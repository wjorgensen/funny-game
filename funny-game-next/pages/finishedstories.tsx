import React from 'react';


interface Story {
  player: string;
  urls: string[];
  prompts: string[];
}

interface StorySlideShowProps {
  story: Story;
}

interface FinishedStoriesProps {
  finishedStories: Story[];
}

const StorySlideShow: React.FC<StorySlideShowProps> = ({ story }) => {
  return (
    <div>
      <h3>Story by: {story.player}</h3>
      {story.urls.map((url, index) => (
        <div key={index}>
          <img src={url} alt={`Slide ${index + 1}`} style={{ maxWidth: '100%' }} />
          <p>{story.prompts[index]}</p>
        </div>
      ))}
    </div>
  );
};

const FinishedStories: React.FC<FinishedStoriesProps> = ({ finishedStories }) => {
  if (!finishedStories || finishedStories.length === 0) {
    return <p>No stories to display.</p>;
  }

  return (
    <div>
      {finishedStories.map((story, index) => (
        <StorySlideShow key={index} story={story} />
      ))}
    </div>
  );
};

export default FinishedStories;
