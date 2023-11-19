import React from 'react';
import styles from './finishedstories.module.scss';

interface Story {
  player: string;
  urls: string[];
  prompts: string[];
}

interface StorySlideShowProps {
  story: Story;
  isLast: boolean;
}

interface FinishedStoriesProps {
  finishedStories: Story[];
}



const StorySlideShow: React.FC<StorySlideShowProps> = ({ story, isLast }) => {
  return (
    <div>
      <div className={styles.storyTitle}>{story.player}'s Story</div>
      {story.urls.map((url, index) => (
        <div key={index} className={styles.storySlideShow}>
          <img src={url} alt={`Slide ${index + 1}`} className={styles.storySlideShowImg} />
          <p className={styles.storySlideShowText}>{story.prompts[index]}</p>
          {/* Render the connecting line if it's not the last image in the story, and the story is not the last one */}
          {index < story.urls.length - 1 && <div className={styles.connectingLine}></div>}
        </div>
      ))}
      {/* Render the connecting line if it's the last image of the story but the story is not the last one */}
      {!isLast && <div className={styles.connectingLine}></div>}
    </div>
  );
};

const FinishedStories: React.FC<FinishedStoriesProps> = ({ finishedStories }) => {
  if (!finishedStories || finishedStories.length === 0) {
    return <p>No stories to display.</p>;
  }

  return (
    <div className={styles.finishedStories}>
      {finishedStories.map((story, index) => (
        <StorySlideShow key={index} story={story} isLast={index === finishedStories.length - 1} />
      ))}
    </div>
  );
};

export default FinishedStories;
