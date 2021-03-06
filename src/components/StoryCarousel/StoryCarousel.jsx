import React from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { deleteStory } from "../../store/user/actions";

export default function StoryCarousel(props) {
  const dispatch = useDispatch();

  const onDelete = (id) => {
    console.log("deleting story!", id);
    dispatch(deleteStory(id));
  };

  return (
    <Carousel className="mt-5">
      {props.space.stories.map((story) => {
        return (
          <Carousel.Item key={story.id}>
            {story.imageUrl && (
              <img
                className="d-block w-100"
                src={story.imageUrl}
                alt={story.name}
              />
            )}
            <Carousel.Caption
              className="p-5"
              style={{
                backgroundColor: `${props.space.backgroundColor}`,
                color: props.space.color,
              }}
            >
              <h3>{story.name}</h3>
              <p>{story.content}</p>
              {props.space && (
                <Button variant="danger" onClick={() => onDelete(story.id)}>
                  Delete story
                </Button>
              )}
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
}
