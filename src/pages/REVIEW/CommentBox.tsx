import React, { useState } from 'react';
import css from './commentbox.module.css'; 
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { urlCreateComment } from '../../endpoint';
import { useAuth } from '../../components/AuthContext';
import { useComments } from './CommentContext';

const CommentBox = () => {
  const [text, setText] = useState('');
  const { MemberId } = useAuth();
  console.log('MemberID: ', MemberId);

  const { id } = useParams();
  console.log('Poster ID: ', id);

  const { addComment, username } = useComments();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    try {
      const response = await axios.post(urlCreateComment, {
        memberID: MemberId,
        posterID: id,
        text: text,
      });
      console.log('Comment: ', text);
      console.log('Response comment box: ', response.data);

      
      addComment({
        userName: username,
        text: text,
        commentID: 0
      });
    } catch (error) {
      console.error('There was an error in comment!', error);
    }

    console.log('Submitted comment:', text);
    setText('');
  };

  return (
    <div className={css.commentBox}>
      <h3>Leave a Comment</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Write your comment here...'
          className={css.commentInput}
          required
        />
        <button type='submit' className={css.submitButton}>
          Send
        </button>
      </form>
    </div>
  );
};

export default CommentBox;
