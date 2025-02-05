import React, { useState } from 'react';
import { Category, CategoryLabel } from '../../constants/category';
import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';

PostCreate.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
};

const PostCreate = ({onSubmit, onCancel, onImageUpload}) => {
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
                onImageUpload={onImageUpload}
            />
            <div>
                <button type='button' onClick={onCancel}>취소</button>
                <button type='submit'>작성완료</button>
            </div>
        </form>
    );
};

export default PostCreate;