import MDEditor from '@uiw/react-md-editor';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import '../styles/ProjectPostForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import { customCommands } from '../../../utils/mdEditorCustomImgIcon';
import { Direction, DirectionLabel } from '../constants/Direction';

const PostForm = ({
  initialData = { category: 'NONE', title: '', content: '', direction: '' },
  isEdit = false,
  onSubmit = () => {},
  onCancel = () => {},
  directionOptions = []
}) => {
  const [direction, setDirection] = useState(initialData.direction);
  const [title, setTitle] = useState(initialData.title);
  const [content, setContent] = useState(initialData.content);

  useEffect(() => {
    setDirection(initialData.direction);
    setTitle(initialData.title);
    setContent(initialData.content);
}, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({direction, title, content});
  }

  return (
    <div className='post-form-container'>
        <form onSubmit={handleSubmit} className='grid-container'>
            <div className='category-section'>
                <div className="category-select-container">
                    <select
                        className='category-select'
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        required
                    >
                        <option value="">카테고리</option>
                        {directionOptions.map(direction => (
                        <option key={direction} value={direction}>
                            {DirectionLabel[direction]}
                        </option>
                        ))}
                    </select>
                    <FontAwesomeIcon className='dropdown-icon' icon={faCaretDown}/>
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
                        commands={customCommands}
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
    directionOptions: PropTypes.arrayOf(
        PropTypes.oneOf(Object.values(Direction))
    )
};

export default PostForm;