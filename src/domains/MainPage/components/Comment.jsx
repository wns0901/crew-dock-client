import React from 'react';

const Comment = () => {
    const [Comments, setComments] = useState([]);
    
    useEffect(() => {
        api.get('/recruitments/{recruitmentsId/comments}')
        .then(response => setComments(response.data.content))
      .catch(error => console.error("데이터 가져오기 실패:", error));
  }, []);

    return (
        <div>
            
        </div>
    );
};

export default Comment;