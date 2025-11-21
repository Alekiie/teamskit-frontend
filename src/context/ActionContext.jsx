import { createContext, useContext } from "react";
import api from "../api/axios";
const ActionContext = createContext();
export const ActionProvider = ({ children }) => {

  const getTasks = async () => {
    const res = await api.get("tasks/");
    return res.data;
  };
  const getUsers = async () => {
    const res = await api.get("users/");
    return res.data;
  };
  return (
    <ActionContext.Provider
      value={{
        getTasks,
        getUsers,
      }}
    >
      {children}
    </ActionContext.Provider>
  );
};
export const useApi = () => useContext(ActionContext);
