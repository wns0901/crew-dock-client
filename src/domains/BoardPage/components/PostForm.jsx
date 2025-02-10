import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Category, CategoryLabel } from '../constants/Category';
import '../styles/PostFormStyle.css';

const PostForm = ({
  initialData = { category: '', title: '', content: '', direction: 'NONE' },
  isEdit = false,
  onSubmit = () => {},
  onCancel = () => {},
  onImageUpload = () => {},
  categoryOptions = []
}) => {
  const [category, setCategory] = useState(initialData.category);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  useEffect(() => {
    setCategory(initialData.category);
    setTitle(initialData.title);
    setContent(initialData.content);
}, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({category, title, content});
  }

  return (
    <div className='post-form-container'>
        <form onSubmit={handleSubmit} className='grid-container'>
            <div className='category-section'>
                <div className="category-select-container">
                    <select
                        className='category-select'
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        required
                    >
                        <option value="">카테고리</option>
                        {categoryOptions.map(category => (
                        <option key={category} value={category}>
                            {CategoryLabel[category]}
                        </option>
                        ))}
                    </select>
                    <span className='dropdown-icon'></span>
                </div>
            </div>

            <div className='title-section'>
                <h3>제목</h3>
                <div className='title-input-container'>
                    <input
                        className='title-input'
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='제목을 입력하세요'
                    />
                </div>
            </div>

            <div className='content-section'>
                <div className='content-editor-contaienr'>
                    <MDEditor
                        value={content}
                        onChange={setContent}
                        onImageUpload={onImageUpload}
                        preview="live"
                        data-color-mode="light"
                        height={400}
                    />
                </div>
            </div>

            <div className='button-section'>
                <button className='cancel-button' type='button' onClick={onCancel}>취소</button>
                <button className='submit-button' type='submit'>{isEdit ? '수정완료' : '작성완료'}</button>
            </div>
        </form>
    </div>
  );
};

PostForm.propTypes = {
    initialData: PropTypes.shape({
        category: PropTypes.string,
        title: PropTypes.string,
        content: PropTypes.string
    }),
    isEdit: PropTypes.bool,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    onImageUpload: PropTypes.func,
    categoryOptions: PropTypes.arrayOf(
        PropTypes.oneOf(Object.values(Category))
    )
};

export default PostForm;