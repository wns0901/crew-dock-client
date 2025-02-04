import React, { useState } from 'react';
import { Category, CategoryLabel } from '../\bconstants/category';

const PostCreate = () => {
    const [category, setCategory] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContnet] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({category, title, content});
    }

    return (
        <form onSubmit={handleSubmit}>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
            >
                <option value="">카테고리</option>
                {Object.values(Category).map(category => (
                    <option key={category} value={category}>
                        {CategoryLabel[category]}
                    </option>
                ))}
            </select>
            <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='제목을 입력하세요'
            />
            <MDEditor
                value={content}
                onChange={setContnet}
            />
            <div>
                <button type='cancle'>취소</button>
                <button type='submit'>작성완료</button>
            </div>
        </form>
    );
};

export default PostCreate;