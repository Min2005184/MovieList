import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { urlGetCommentsById, urlGetMemberById, urlCreateReply, urlGetReplyById } from '../../endpoint';
import './showcomment.css'; // Ensure this path is correct
import { useComments } from './CommentContext';
import { useAuth } from '../../components/AuthContext';
import { Link } from 'react-router-dom';

interface ShowCommentProps {
  posterId: any;
}

const ShowComment = ({ posterId }: ShowCommentProps) => {
  const { comments, setComments, setUserName } = useComments();
  const { MemberId } = useAuth();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [replies, setReplies] = useState<{ [key: number]: any[] }>({});
  const [visibleReplies, setVisibleReplies] = useState<{ [key: number]: boolean }>({});

  const loadData = async () => {
    try {
      const response = await axios.get(`${urlGetCommentsById}/${posterId}`);
      console.log('Response Data: ', response.data);

      if (!response.data) {
        console.error('No response data received.');
        alert('Failed to load data. Please try again.');
        return;
      }
      setComments(response.data);

      const getUserName = await axios.get(`${urlGetMemberById}/${MemberId}`);
      console.log("GET userNAME: ", getUserName.data.userName);
      setUserName(getUserName.data.userName);

      // Load replies for each comment
      response.data.forEach((comment: any) => loadReplies(comment.commentID));
      
    } catch (error) {
      console.error('There was an error:', error);
    }
  };

  const loadReplies = async (commentId: number) => {
    try {
      const response = await axios.get(`${urlGetReplyById}/${commentId}`);
      console.log('Replies Data: ', response.data);
      setReplies((prevReplies) => ({ ...prevReplies, [commentId]: response.data }));
    } catch (error) {
      console.error('There was an error fetching replies:', error);
    }
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
    setVisibleReplies((prevVisibleReplies) => ({
      ...prevVisibleReplies,
      [commentId]: !prevVisibleReplies[commentId],
    }));
  };

  const handleReplySubmit = async (event: React.FormEvent<HTMLFormElement>, parentCommentId: number) => {
    event.preventDefault();
    try {
      const response = await axios.post(urlCreateReply, {
        posterID: posterId,
        memberID: MemberId,
        userName: "",
        commentText: replyText, // Match the field name used in your backend
        parentCommentID: parentCommentId,
      });

      console.log('Reply: ', replyText);
      console.log('Response: ', response.data);

      loadReplies(parentCommentId);
    } catch (error) {
      console.error('There was an error in reply submission!', error);
    }

    setReplyText('');
    setReplyingTo(null);
  };

  useEffect(() => {
    loadData();
  }, [posterId]);

  return (
    <div className="comments-container">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <div key={comment.commentID} className="comment">
            <p>
              <strong>{comment.userName}</strong>: <span className="comment-text">{comment.text}</span>
            </p>

            <Link to={'#'} style={{ marginLeft: '80%', textDecoration: 'none', color: 'white' }} onClick={() => handleReply(comment.commentID)}>Reply</Link>
            
            {replyingTo === comment.commentID && (
              <form onSubmit={(e) => handleReplySubmit(e, comment.commentID)}>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply here..."
                  required
                />
                <button style={{ marginLeft: '65%' }} type="submit">Reply</button>
              </form>
            )}

            {visibleReplies[comment.commentID] && replies[comment.commentID] &&
              <div key={comment.commentID} className="replies">
                {replies[comment.commentID].map((reply) => 
                  <div key={reply.replyID} className="reply">
                    <p>
                      <strong>{reply.userName}</strong>: <span className="reply-text">{reply.commentText}</span>
                    </p>
                  </div>
                )}
              </div>
            }
            
          </div>
        ))
      ) : (
        <p>No comments found.</p>
      )}
    </div>
  );
};

export default ShowComment;
