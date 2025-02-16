import { useContext } from "react";
import { useNavigate } from "react-router-dom"
import { LoginContext } from "../../../contexts/LoginContextProvider";
import { Category } from "../constants/Category";


export const usePostForm = () => {
    const navigate = useNavigate();
    const {roles} = useContext(LoginContext);

    const categoryOptions = Object.values(Category).filter(category => {
        const isAdmin = roles?.isAdmin ?? false;
        if (isAdmin) {
          return true;
        }
        return category === Category.NONE || category === Category.FORUM;
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
        categoryOptions,
        validatePost,
        navigate,
        onCancel
    };
}
