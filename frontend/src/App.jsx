import Screen from "./components/Screens/Screen";
import Welcome from "./components/Screens/Welcome";
import BaseSideBar from "./components/Base/BaseSidebar";
import { usersRoute, host } from "./utils/api";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import BaseMiniSidebar from "./components/Base/BaseMiniSidebar";

function App() {
  const navigate = useNavigate();

  const socket = useRef();

  const [contacts, setContacts] = useState([]);

  const [currentChat, setCurrentChat] = useState(undefined);

  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const fetchData = async () => {
      if (!localStorage.getItem(import.meta.env.VITE_AUTH_USER)) {
        navigate("/login");
      } else {
        setCurrentUser(
          await JSON.parse(localStorage.getItem(import.meta.env.VITE_AUTH_USER))
        );
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);

      currentUser.is_active = true;

      socket.current.emit("add-user", currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        const data = await axios.get(`${usersRoute}/${currentUser._id}`);

        setContacts(data.data);
      }
    };

    fetchData();
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className="flex">
        <div className="flex">
          <BaseMiniSidebar></BaseMiniSidebar>

          <BaseSideBar
            contacts={contacts}
            changeChat={handleChatChange}
          ></BaseSideBar>
        </div>

        {!currentChat ? (
          <Welcome />
        ) : (
          <Screen
            currentChat={currentChat}
            setCurrentChat={setCurrentChat}
            socket={socket}
          ></Screen>
        )}
      </div>
    </>
  );
}

export default App;
