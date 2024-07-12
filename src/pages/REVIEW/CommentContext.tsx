import { createContext, useState, useContext, ReactNode } from 'react';

interface CommentModel {
  userName: string;
  commentID: any;
  text: string;
}

interface CommentsContextProps {
  comments: CommentModel[];
  username: string;
  setUserName: (username: string) => void
  addComment: (comment: CommentModel) => void;
  setComments: (comments: CommentModel[]) => void; // Add setComments
}

const CommentsContext = createContext<CommentsContextProps | undefined>(undefined);

export const CommentsProvider = ({ children }: { children: ReactNode }) => {
  const [comments, setComments] = useState<CommentModel[]>([]);
  const [username, setUserName] = useState<string>("")

  const addComment = (comment: CommentModel) => {
    setComments(prevComments => [comment, ...prevComments, ]);
  };

  return (
    <CommentsContext.Provider value={{ comments, addComment, setComments, username, setUserName }}>
      {children}
    </CommentsContext.Provider>
  );
};

export const useComments = () => {
  const context = useContext(CommentsContext);
  if (!context) {
    throw new Error('useComments must be used within a CommentsProvider');
  }
  return context;
};
