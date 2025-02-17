import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Direction } from "../constants/Direction";

export const useProjectPostForm = () => {
    const navigate = useNavigate();
    const {roles, projectRoles} = useContext(LoginContext);

    const isCaptain = projectRoles.some(role => role.role.isCaptain);

    const directionOptions = Object.values(Direction).filter(direction => {
        const isAdmin = roles?.isAdmin ?? false;
        if (isAdmin) {
          return true;
        }
        if (isCaptain) {
            return direction === Direction.NOTICE || 
                   direction === Direction.MINUTES ||
                   direction === Direction.REFERENCE ||
                   direction === Direction.NONE ||
                   direction === Direction.FORUM;
          }
          return direction === Direction.MINUTES ||
                 direction === Direction.REFERENCE ||
                 direction === Direction.NONE ||
                 direction === Direction.FORUM;
    });

    const validatePost = (postData) => {
        if(!postData.title.trim()) {
            alert('제목을 입력해주세요.');
            return false;
        }
        if(!postData.content.trim()) {
            alert('내용을 입력해주세요.');
            return false;
        }
        return true;
    }

    const onCancel = () => {
        navigate(-1);
    };

    return {
        directionOptions,
        validatePost,
        navigate,
        onCancel
    };
}
