import { useParams, useNavigate } from "react-router-dom";
import css from "./Review.module.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommentBox from "./CommentBox"; // Ensure this path is correct
import { useAuth } from "../../components/AuthContext";
import axios from "axios";
import { urlGetPosterById, urlGetDataById } from "../../endpoint";
import ShowComment from "./ShowComment";

function Review() {
  const { id }: any = useParams();
  const { MemberId, isAuthenticated, setPosterID } = useAuth(); // Use a single call to useAuth
  const navigate = useNavigate();

  const [poster, setPoster] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [trailer, setTrailer] = useState<string>("");

  useEffect(() => {
    setPosterID(id);
  }, [id, setPosterID]);

  const getImageUrl = (id: number) => {
    const url = `${urlGetPosterById}/${id}`;
    return url;
  };

  const handleTrailer = () => {
    setShowComment(false);
    setShowTrailer(!showTrailer);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await axios.get(`${urlGetDataById}/${id}`);
        if (!response.data) {
          alert("Failed to load data. Please try again.");
          return;
        }

        const imageURL = getImageUrl(response.data.movieID);
        setPoster(imageURL);
        setTitle(response.data.title);
        setSummary(response.data.description);
        setTrailer(response.data.trailer);
      } catch (error) {
        console.error("There was an error:", error);
      }
    };

    loadData();
  }, [id]);

  const handleShowComment = () => {
    if (isAuthenticated) {
      setShowTrailer(false);
      setShowComment(!showComment);
    } else {
      const confirmed = window.confirm("You need to register first!");
      if (confirmed) {
        navigate(`/register`);
      }
    }
  };

  return (
    <div className={css.background}>
      <div className={css.container}>
        <div className={css.content}>
          {poster ? (
            <img src={poster} alt={title} className={css.image} />
          ) : (
            <p>Image not found</p>
          )}
          {title ? (
            <h2 className={css.title}>{title}</h2>
          ) : (
            <p>Title not found!</p>
          )}
          {summary ? (
            <p className={css.summary}>{summary}</p>
          ) : (
            <p>Summary not found</p>
          )}
        </div>

        <div className={css.navbar}>
          <Link to="#watch_trailer" style={{ textDecoration: "none", paddingRight: "30px" }} onClick={handleTrailer}>
            Watch Trailer
          </Link>

          <Link to={`#review/${MemberId}`} style={{ textDecoration: "none" }} onClick={handleShowComment}>
            Review
          </Link>
        </div>

        {showTrailer && (
          <div id="watch_trailer">
            <iframe
              width="560"
              height="315"
              src={trailer}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              className={css.trailer}
            ></iframe>
          </div>
        )}
        {showComment && (
          <div id="review/:id?">
            <ShowComment posterId={id} />
            <CommentBox />
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;
