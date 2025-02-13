import React, { useState } from 'react';
import styled from 'styled-components';
import HeartEmptyIcon from '../assets/heart-empty.png';
import HeartFilledIcon from '../assets/heart-filled.png';

interface EventCardProps {
  id: number;
  thumbnail: { fileUrl: string };
  title: string;
  startDate: string;
  endDate: string;
  onClick: (id: number) => void;
  onHeartClick?: (id: number) => void;
}

const EventCardContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const EventPosterWrapper = styled.div`
  position: relative;
  width: 199px;
  height: 208px;
  margin-bottom: 0.5rem;
`;

const EventPoster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const HeartButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  z-index: 1;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const HeartImage = styled.img`
  width: 24px;
  height: 24px;
`;

const EventDetails = styled.div`
  text-align: center;
`;

const EventName = styled.h4`
  margin-bottom: 0.2rem;
  color: #fff;
  font-family: 'Gothic A1';
  font-size: 18px;
  font-weight: 600;
`;

const EventDates = styled.p`
  color: #fff;
  text-align: center;
  font-family: 'Gothic A1';
  font-size: 16px;
  font-weight: 600;
`;

const EventCard: React.FC<EventCardProps> = ({
  id,
  thumbnail,
  title,
  startDate,
  endDate,
  onClick,
  onHeartClick,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onHeartClick) {
      onHeartClick(id);
    }
  };

  return (
    <EventCardContainer onClick={() => onClick(id)}>
      <EventPosterWrapper>
        <EventPoster src={thumbnail.fileUrl} alt={title} />
        <HeartButton onClick={handleHeartClick}>
          <HeartImage src={isFavorite ? HeartFilledIcon : HeartEmptyIcon} alt="Favorite" />
        </HeartButton>
      </EventPosterWrapper>
      <EventDetails>
        <EventName>{title}</EventName>
        <EventDates>
          {startDate} - {endDate}
        </EventDates>
      </EventDetails>
    </EventCardContainer>
  );
};

export default EventCard;
