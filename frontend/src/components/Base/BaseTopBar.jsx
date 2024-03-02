import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./BaseConfirmationModal";
import axios from "axios";
import { logoutRoute } from "../../utils/api";

function TopBar() {
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedData = localStorage.getItem(import.meta.env.VITE_AUTH_USER);
        if (storedData) {
          setCurrentUser(JSON.parse(storedData));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);

  const handleOpenModal = () => {
    setConfirmationModalOpen(true);
  };

  const handleCloseModal = () => {
    setConfirmationModalOpen(false);
  };

  const navigate = useNavigate();
  const handleConfirmAction = async () => {
    const id = await JSON.parse(
      localStorage.getItem(import.meta.env.VITE_AUTH_USER),
    )._id;

    const data = await axios.get(`${logoutRoute}/${id}`);

    console.log(data);

    if (data.status === 200) {
      localStorage.clear();

      navigate("/login");
    }

    handleCloseModal();
  };

  return (
    <>
      <div className="relative p-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl">Chats</span>
          </div>
          <div>
            <div className="flex justify-between gap-4">
              {/* <img
                src="./group.png"
                className="bg-gray-300 p-1 h-7 w-7 rounded-full cursor-pointer"
                alt="Group"
              />
              <img
                src="./status.png"
                className="bg-gray-300 p-1 h-7 w-7 rounded-full cursor-pointer"
                alt="Status"
              />
              <img
                src="./marketing.png"
                className="bg-gray-300 p-1 h-7 w-7 rounded-full cursor-pointer"
                alt="Marketing"
              /> */}
              <img
                src="./dots.png"
                onClick={handleOpenModal}
                className="bg-gray-300 p-1 h-7 w-7 rounded-full cursor-pointer"
                alt="Marketing"
              />
              <ConfirmationModal
                isOpen={isConfirmationModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmAction}
                title="Confirmation"
                content="Are you sure you want to perform this action?"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopBar;
