import {Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChildren} from '@angular/core';
import {ChatAdapter} from './core/chat-adapter';
import {User} from './core/user';
import {Message} from './core/message';
import {Window} from './core/window';
import {UserStatus} from './core/user-status.enum';
import {Localization, StatusDescription} from './core/localization';
import 'rxjs/add/operator/map';
import {ChatService} from '../../services/chat.service';
import {UploadMediaAttachComponent} from '../upload-media-attach/upload-media-attach.component';
import {MatDialog} from '@angular/material';
import {NewVideoModalComponent} from '../new-video-modal/new-video-modal.component';
import {NewAudioModalComponent} from '../new-audio-modal/new-audio-modal.component';
import {getFromLocalStorage, removeFromLocalStorage, setToLocalStorage} from '../../utils/local-storage';


@Component({
  selector: 'app-ng-chat',
  templateUrl: 'ng-chat.component.html',
  styleUrls: [
    './assets/icons.css',
    './assets/ng-chat.component.default.css',
    './assets/loading-spinner.css'
  ]
})

export class NgChatComponent implements OnInit {
  // Exposes the enum for the template
  attachments = [];
  attached = [];
  dialogRef;
  UserStatus = UserStatus;
  @Input()
  public adapter: ChatAdapter;
  @Input()
  public userId: any;
  @Input()
  public isCollapsed = false;
  @Input()
  public maximizeWindowOnNewMessage = true;
  @Input()
  public pollFriendsList = false;
  @Input()
  public pollingInterval = 5000;
  @Input()
  public historyEnabled = true;
  @Input()
  public emojisEnabled = true;
  @Input()
  public linkfyEnabled = true;
  @Input()
  public audioEnabled = true;
  @Input() // TODO: This might need a better content strategy
  public audioSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.wav';
  @Input()
  public persistWindowsState = true;
  @Input()
  public title = 'Chat history';
  @Input()
  public messagePlaceholder = 'Type a message';
  @Input()
  public searchPlaceholder = 'Search';
  @Input()
  public browserNotificationsEnabled = true;
  @Input() // TODO: This might need a better content strategy
  public browserNotificationIconSource = 'https://raw.githubusercontent.com/rpaschoal/ng-chat/master/src/ng-chat/assets/notification.png';
  @Input()
  public localization: Localization;
  @Output()
  public onUserClicked: EventEmitter<User> = new EventEmitter<User>();
  @Output()
  public onUserChatOpened: EventEmitter<User> = new EventEmitter<User>();
  @Output()
  public onUserChatClosed: EventEmitter<User> = new EventEmitter<User>();
  public searchInput = '';
  windows: Window[] = [];
  isBootstrapped = false;
  @ViewChildren('chatMessages') chatMessageClusters: any;
  @ViewChildren('chatWindowInput') chatWindowInputs: any;
  private browserNotificationsBootstrapped = false;
  private statusDescription: StatusDescription = {
    online: 'Online',
    busy: 'Busy',
    away: 'Away',
    offline: 'Offline'
  };
  private audioFile: HTMLAudioElement;
  private users: any;
  // Defines the size of each opened window to calculate how many windows can be opened on the viewport at the same time.
  private windowSizeFactor = 320;
  // Total width size of the friends list section
  private friendsListWidth = 262;
  // Available area to render the plugin
  private viewPortTotalArea;

  smileOpen = false;
  messNotReq: any[];
  public messnotifylength;

  constructor(
      private chatService: ChatService,
      public dialog: MatDialog,
  ) {
  }

  get filteredUsers(): User[] {
    if (this.searchInput.length > 0) {
      // Searches in the friend list by the inputted search string
      return this.users.filter(x => {
        return x.user_name.toUpperCase().includes(this.searchInput.toUpperCase()) || x.user_last_name.toUpperCase().includes(this.searchInput.toUpperCase());
      });
    }
    return this.users;
  }

  private get localStorageKey(): string {
    return `ng-chat-users-${this.userId}`;
  }

  ngOnInit() {

    this.userId = getFromLocalStorage('GLOBE_USER').id;

    // window.newMessage = '';
    this.bootstrapChat();
    this.chatService.change.subscribe(res => {
      res.status = 'online';
      this.openChatWindow(res, false, false);
      console.log(res);
    });
    // if (this.userId) {
    //   setInterval(() => {
    //     this.getMessageNotify();
    //   }, 10000);
    // }

  }

  getMessageNotify() {
    this.chatService.getMessageNotify().subscribe((res: any[]) => {
      this.messNotReq = res;
      this.messnotifylength = res['body'].length;

    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.viewPortTotalArea = event.target.innerWidth;

    this.NormalizeWindows();
  }

  // Returns the total unread messages from a chat window. TODO: Could use some Angular pipes in the future
  unreadMessagesTotal(window: Window): string {
    if (window) {
      if (window.hasFocus) {
        this.markMessagesAsRead(window.messages);
      } else {
        let totalUnreadMessages = window.messages.filter(x => x.from_id !== this.userId && !x.seenOn).length;

        if (totalUnreadMessages > 0) {

          if (totalUnreadMessages > 99) {
            return '99+';
          } else {
            return String(totalUnreadMessages);
          }

        }
      }
    }

    // Empty fallback.
    return '';
  }

  unreadMessagesTotalByUser(user: User): string {
    let openedWindow = this.windows.find(x => x.chattingTo.id === user.id);

    if (openedWindow) {
      return this.unreadMessagesTotal(openedWindow);
    }

    // Empty fallback.
    return '';
  }

  /*  Monitors pressed keys on a chat window
      - Dispatches a message when the ENTER key is pressed
      - Tabs between windows on TAB or SHIFT + TAB
      - Closes the current focused window on ESC
  */
  onChatInputTyped(event: any, window: Window): void {
    switch (event.keyCode) {
      case 13:
        this.sendMessage(event, window);
        break;
      case 9:
        event.preventDefault();

        let currentWindowIndex = this.windows.indexOf(window);
        let messageInputToFocus = this.chatWindowInputs.toArray()[currentWindowIndex + (event.shiftKey ? 1 : -1)]; // Goes back on shift + tab

        if (!messageInputToFocus) {
          // Edge windows, go to start or end
          messageInputToFocus = this.chatWindowInputs.toArray()[currentWindowIndex > 0 ? 0 : this.chatWindowInputs.length - 1];
        }

        messageInputToFocus.nativeElement.focus();

        break;
      case 27:
        let closestWindow = this.getClosestWindow(window);

        if (closestWindow) {
          this.focusOnWindow(closestWindow, () => {
            this.onCloseChatWindow(window);
          });
        } else {
          this.onCloseChatWindow(window);
        }
    }
  }

  // Closes a chat window via the close 'X' button
  onCloseChatWindow(window: Window): void {
    let index = this.windows.indexOf(window);

    this.windows.splice(index, 1);

    this.updateWindowsState(this.windows);

    this.onUserChatClosed.emit(window.chattingTo);
  }

  // Toggle friends list visibility
  onChatTitleClicked(event: any): void {
    this.isCollapsed = !this.isCollapsed;
  }

  // Toggles a chat window visibility between maximized/minimized
  onChatWindowClicked(window: Window): void {
    window.isCollapsed = !window.isCollapsed;
    this.scrollChatWindowToBottom(window);
  }

  // Asserts if a user avatar is visible in a chat cluster
  isAvatarVisible(window: Window, message: Message, index: number): boolean {
    if (message.from_id && message.from_id !== this.userId) {
      if (index === 0) {
        return true; // First message, good to show the thumbnail
      } else {
        // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
        if (window.messages[index - 1].from_id !== message.from_id) {
          return true;
        }
      }
    }

    return false;
  }

  // Opens a new chat whindow. Takes care of available viewport

  // Toggles a window focus on the focus/blur of a 'newMessage' input
  toggleWindowFocus(window: Window): void {
    window.hasFocus = !window.hasFocus;
  }

  // [Localized] Returns the status descriptive title
  getStatusTitle(status: UserStatus): any {
    let status1 = status || 'Offline';
    let currentStatus = status1.toString().toLowerCase();

    return this.localization.statusDescription[currentStatus];
  }

  // Checks if there are more opened windows than the view port can display
  private NormalizeWindows(): void {
    const maxSupportedOpenedWindows = Math.floor(this.viewPortTotalArea / this.windowSizeFactor);
    const difference = this.windows.length - maxSupportedOpenedWindows;

    if (difference >= 0) {
      this.windows.splice(this.windows.length - 1 - difference);
    }
  }

  // Initializes the chat plugin and the messaging adapter
  private bootstrapChat(): void {
    if (this.adapter != null && this.userId != null) {
      this.viewPortTotalArea = window.innerWidth;

      this.initializeDefaultText();
      this.initializeBrowserNotifications();

      // Binding event listeners
      this.adapter.messageReceivedHandler = (user, msg) => this.onMessageReceived(user, msg);
      this.adapter.friendsListChangedHandler = (users) => this.onFriendsListChanged(users);

      // Loading current users list
      if (this.pollFriendsList) {
        // Setting a long poll interval to update the friends list
        this.fetchFriendsList(true);
        setInterval(() => this.fetchFriendsList(false), this.pollingInterval);
      } else {
        // Since polling was disabled, a friends list update mechanism will have to be implemented in the ChatAdapter.
        this.fetchFriendsList(true);
      }

      this.bufferAudioFile();

      this.isBootstrapped = true;
    }

    if (!this.isBootstrapped) {
      console.error('ng-chat component couldn\'t be bootstrapped.');

      if (this.userId == null) {
        console.error('ng-chat can\'t be initialized without an user id. Please make sure you\'ve provided an userId as a parameter of the ng-chat component.');
      }
      if (this.adapter == null) {
        console.error('ng-chat can\'t be bootstrapped without a ChatAdapter. Please make sure you\'ve provided a ChatAdapter implementation as a parameter of the ng-chat component.');
      }
    }
  }

  // Initializes browser notifications
  private async initializeBrowserNotifications() {
    if (this.browserNotificationsEnabled && ('Notification' in window)) {
      if (await Notification.requestPermission()) {
        this.browserNotificationsBootstrapped = true;
      }
    }
  }

  // Initializes default text
  private initializeDefaultText(): void {
    if (!this.localization) {
      this.localization = {
        messagePlaceholder: this.messagePlaceholder,
        searchPlaceholder: this.searchPlaceholder,
        title: this.title,
        statusDescription: this.statusDescription
      };
    }
  }

  // Sends a request to load the friends list
  private fetchFriendsList(isBootstrapping: boolean): void {
    this.adapter.listFriends()
        .subscribe((users: any) => {
      this.users = users.body;
      if (isBootstrapping) {
        this.restoreWindowsState();
      }
    });
  }

  // Updates the friends list via the event handler
  private onFriendsListChanged(users: User[]): void {
    if (users) {
      this.users = users;
    }
  }

  // Handles received messages by the adapter
  private onMessageReceived(user: User, message: Message) {
    if (user && message) {
      const chatWindow = this.openChatWindow(user);

      if (!chatWindow[1] || !this.historyEnabled) {
        chatWindow[0].messages.push(message);

        this.scrollChatWindowToBottom(chatWindow[0]);
      }

      this.emitMessageSound(chatWindow[0]);

      if (this.maximizeWindowOnNewMessage || (!chatWindow[1] && !chatWindow[0].isCollapsed)) {
        // Some messages are not pushed because they are loaded by fetching the history hence why we supply the message here
        this.emitBrowserNotification(chatWindow[0], message);
      }
    }
  }

  // Returns => [Window: Window object reference, boolean: Indicates if this window is a new chat window]
  private openChatWindow(user: User, focusOnNewWindow: boolean = false, invokedByUserClick: boolean = false): [Window, boolean] {
    // Is this window opened?
    let openedWindow = this.windows.find(x => x.chattingTo.id === user.id);

    if (!openedWindow) {
      if (invokedByUserClick) {
        this.onUserClicked.emit(user);
      }

      // Refer to issue #58 on Github
      let collapseWindow = invokedByUserClick ? false : !this.maximizeWindowOnNewMessage;

      let newChatWindow: Window = {
        chattingTo: user,
        messages: [],
        isLoadingHistory: this.historyEnabled,
        hasFocus: false, // This will be triggered when the 'newMessage' input gets the current focus
        isCollapsed: collapseWindow
      };

      // Loads the chat history via an RxJs Observable
      if (this.historyEnabled) {
        this.adapter.getMessageHistory(newChatWindow.chattingTo.id)
            .map((result: any) => {

              newChatWindow.messages = result.body.concat(newChatWindow.messages);
              newChatWindow.isLoadingHistory = false;

              setTimeout(() => {
                this.scrollChatWindowToBottom(newChatWindow);
              });
            }).subscribe();
      }

      this.windows.unshift(newChatWindow);

      // Is there enough space left in the view port ?
      if (this.windows.length * this.windowSizeFactor >= this.viewPortTotalArea - this.friendsListWidth) {
        this.windows.pop();
      }

      this.updateWindowsState(this.windows);

      if (focusOnNewWindow && !collapseWindow) {
        this.focusOnWindow(newChatWindow);
      }

      this.onUserChatOpened.emit(user);

      return [newChatWindow, true];
    } else {
      // Returns the existing chat window
      return [openedWindow, false];
    }
  }

  // Focus on the input element of the supplied window
  private focusOnWindow(window: Window, callback: Function = () => {
  }): void {
    let windowIndex = this.windows.indexOf(window);

    if (windowIndex >= 0) {
      setTimeout(() => {
        let messageInputToFocus = this.chatWindowInputs.toArray()[windowIndex];

        messageInputToFocus.nativeElement.focus();

        callback();
      });
    }
  }

  // Scrolls a chat window message flow to the bottom
  private scrollChatWindowToBottom(window: Window): void {
    if (!window.isCollapsed) {
      let windowIndex = this.windows.indexOf(window);

      setTimeout(() => {
        if (this.chatMessageClusters) {
          this.chatMessageClusters.toArray()[windowIndex].nativeElement.scrollTop = this.chatMessageClusters.toArray()[windowIndex].nativeElement.scrollHeight;
        }
      });
    }
  }

  // Marks all messages provided as read with the current time.
  private markMessagesAsRead(messages: Message[]): void {
    let currentDate = new Date();

    messages.forEach((msg) => {
      msg.seenOn = currentDate;
    });
  }

  // Buffers audio file (For component's bootstrapping)
  private bufferAudioFile(): void {
    if (this.audioSource && this.audioSource.length > 0) {
      this.audioFile = new Audio();
      this.audioFile.src = this.audioSource;
      this.audioFile.load();
    }
  }

  // Emits a message notification audio if enabled after every message received
  private emitMessageSound(window: Window): void {
    if (this.audioEnabled && !window.hasFocus && this.audioFile) {
      this.audioFile.play();
    }
  }

  // Emits a browser notification
  private emitBrowserNotification(window: Window, message: any): void {
    if (this.browserNotificationsBootstrapped && !window.hasFocus && message) {
      let notification = new Notification(`New message from ${window.chattingTo.user_name}`, {
        'body': window.messages[window.messages.length - 1].content,
        'icon': this.browserNotificationIconSource
      });

      setTimeout(() => {
        notification.close();
      }, message.content.length <= 50 ? 5000 : 7000); // More time to read longer messages
    }
  }

  // Saves current windows state into local storage if persistence is enabled
  private updateWindowsState(windows: Window[]): void {
    if (this.persistWindowsState) {
      let usersIds = windows.map((w) => {
        return w.chattingTo.id;
      });

      localStorage.setItem(this.localStorageKey, JSON.stringify(usersIds));
    }
  }

  private restoreWindowsState(): void {
    try {
      if (this.persistWindowsState) {
        let stringfiedUserIds = localStorage.getItem(this.localStorageKey);

        if (stringfiedUserIds && stringfiedUserIds.length > 0) {
          let userIds = < number[] > JSON.parse(stringfiedUserIds);

          let usersToRestore = this.users.filter(u => userIds.indexOf(u.id) >= 0);

          usersToRestore.forEach((user) => {
            this.openChatWindow(user);
          });
        }
      }
    } catch (ex) {
      console.log(`An error occurred while restoring ng-chat windows state. Details: ${ex}`);
    }
  }

  // Gets closest open window if any. Most recent opened has priority (Right)
  private getClosestWindow(window: Window): Window | undefined {
    let index = this.windows.indexOf(window);

    if (index > 0) {
      return this.windows[index - 1];
    } else if (index === 0 && this.windows.length > 1) {
      return this.windows[index + 1];
    }
  }

  openDialogAttach($event, window) {
    this.dialogRef = this.dialog.open(UploadMediaAttachComponent, {
      height: 'auto',
      width: '500px',
    });

    this.dialogRef.componentInstance.onUpload.subscribe((res: any) => {
      console.log(JSON.parse(res).id);

      this.attachments.push(JSON.parse(res).id);
      this.attached.push(JSON.parse(res));
      let message = new Message();

      message.from_id = this.userId;
      message.for_id = window.chattingTo.id;
      message.content = ''; // window.newMessage;
      message.attachments = this.attachments;

      if (message.attachments && message.attachments.length > 0) {
        this.adapter.sendMessage(message).subscribe(res1 => {
          console.log(message);
          console.log(res);
          window.messages.push(res1);
          this.attachments = [];
        });
        window.newMessage = ''; // Resets the new message input
        this.scrollChatWindowToBottom(window);
      }
      this.dialogRef.close();
    });


  }

  openDialogVideo() {
    const dialogRef = this.dialog.open(NewVideoModalComponent, {
      height: 'auto'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  openDialogAudio() {
    const dialogRef = this.dialog.open(NewAudioModalComponent, {
      height: '350px'
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  sendMessage($event, window) {
    console.log(window.newMessage);
    if (window.newMessage && window.newMessage.trim() !== '') {
      let message = new Message();

      message.from_id = this.userId;
      message.for_id = window.chattingTo.id;
      message.content = window.newMessage;

      // window.messages.push(message);

      this.adapter.sendMessage(message).subscribe(res => {
            console.log(message);
            console.log(res);
            res.body ? window.messages.push(res.body) : window.messages.push(res);
            this.scrollChatWindowToBottom(window);
          },
          error => {
            console.log(error);
          });

      window.newMessage = ''; // Resets the new message input

      this.scrollChatWindowToBottom(window);
    }
  }

  openSmiles(window) {
    window.smileOpen = !window.smileOpen;
  }

  addSmile(e, window) {
    window.newMessage = window.newMessage ? window.newMessage + ` *${e}* ` : ` *${e}* `;
    window.smileOpen = false;
    console.log(e);
  }

}
