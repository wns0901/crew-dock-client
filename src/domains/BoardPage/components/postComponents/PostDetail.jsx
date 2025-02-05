import React from 'react';

const PostDetail = ({postId}) => {
    const [post, setPost] = useState(null);

    return (
        <div className='post-detail'>
            <div className='post-category'>{post?.category}</div>
            <h1>{post?.title}</h1>
            <div className='post-info'>
                
            </div>
        </div>
    );
};

export default PostDetail;