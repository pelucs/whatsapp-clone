import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyBYAIiYok_H0al8rgJDz7R_3GGVR3sX6dQ",
  authDomain: "whatsapp-130.firebaseapp.com",
  projectId: "whatsapp-130",
  storageBucket: "whatsapp-130.appspot.com",
  messagingSenderId: "531654389245",
  appId: "1:531654389245:web:9916fcc5de87daf27a3d94"
});

const auth = firebase.auth();
const db = firebase.firestore();

export default {
  popUpGoogle: async () => {
    const provider = new firebase.auth.GoogleAuthProvider(),
          result = await auth.signInWithPopup(provider);

    return result;
  },
  addUser: async user => {
    await db.collection("users").doc(user.id).set({
      name: user.name,
      avatar: user.avatar
    }, {merge: true});
  },
  getContactList: async id => {
    let list = [];

    let result = await db.collection("users").get();
    result.forEach(result => {
      let data = result.data();

      if(result.id !== id){
        list.push({
          id: result.id,
          name: data.name,
          avatar: data.avatar
        })
      }
    });
    return list;
  },
  addNewChat: async (user, user2) => {
    let newChat = await db.collection("chats").add({
      messages: [],
      users: [user.id, user2.id]
    });

    db.collection("users").doc(user.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user2.name,
        image: user2.avatar,
        with: user2.id
      })
    });

    db.collection("users").doc(user2.id).update({
      chats: firebase.firestore.FieldValue.arrayUnion({
        chatId: newChat.id,
        title: user.name,
        image: user.avatar,
        with: user.id
      })
    });
  },
  onChatList: (userId, setChatList) => {
    return db.collection("users").doc(userId).onSnapshot(doc => {
      if(doc.exists){
        let data = doc.data();

        if(data.chats){
          let chats = [...data.chats];
          chats.sort((a, b) => {
            if(a.lastMessageDate == undefined){
                return -1;
            }
            if(b.lastMessageDate == undefined){
              return -1;
          }
            if(a.lastMessageDate.seconds < b.lastMessageDate.seconds){
              return 1;
            } else{
              return -1;
            }
          })

          setChatList(data.chats);
        }
      }
    });
  },
  onChatContent: (chatId, setList, setUsers) => {
    return db.collection("chats").doc(chatId).onSnapshot(doc => {
      if(doc.exists){
        let data = doc.data();
        setList(data.messages);
        setUsers(data.users);
      }
    })
  },
  sendMessage: async (chatData, userId, type, body, users) => {
    let date = new Date();

    db.collection("chats").doc(chatData.chatId).update({
      messages: firebase.firestore.FieldValue.arrayUnion({
        type,
        author: userId,
        body,
        date  
      })
    });

    for(let i in users){
      let u = await db.collection("users").doc(users[i]).get(),
          uData = u.data();

          if(uData.chats){
            let chats = [...uData.chats];

            for(let e in chats){
              if(chats[e].chatId == chatData.chatId){
                chats[e].lastMessage = body;
                chats[e].lastMessageDate = date;
              }
            }

            await db.collection("users").doc(users[i]).update({
              chats
            })
          }
    }
  }
};