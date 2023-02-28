import styled from "styled-components";
import { forwardRef } from "react";
import EditableParagraph from "./EditableParagraph";
import Separator from "./Separator";
import Image from "./Image";
import Title from "./Title";

const BlockContainer = styled.div`
    height: auto;
    width: 100%;
    box-sizing: border-box;

    &:hover{
      cursor: pointer;
    }
`;

function Block(props, ref) {
  const {
    id,
    Tag,
    page,
    content,
    pageRef,
    articleRef,
    currentArticleData,
    setCurrentArticleData,
  } = props;


  const handleDragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();

    const sourceId = event.dataTransfer.getData("text/plain");
    const sourceIndex = currentArticleData[page].findIndex(
      (item) => item.id === Number(sourceId)
    );

    const targetIndex = currentArticleData[page].findIndex(
      (item) => item.id === Number(id)
    );

    if (
      sourceIndex !== -1 &&
      targetIndex !== -1 &&
      sourceIndex !== targetIndex
    ) {
      const updatePageData = [...currentArticleData[page]];
      const [removed] = updatePageData.splice(sourceIndex, 1);
      updatePageData.splice(targetIndex, 0, removed);
      
      if(pageRef.current.lastChild.offsetHeight >= 1020){
        setCurrentArticleData([...currentArticleData, currentArticleData[page] = updatePageData]);
        return;
      } else {
        currentArticleData[page] = updatePageData;
        
        return;
      }
    }
  };

  const handleDragEnd = (event) => {
    // implementar qualquer ação de limpeza ou feedback visual após o drop
  };

  return (
    <BlockContainer
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnd={handleDragEnd}
    >
      {Tag === "img" && (
        <Image
          id={id}
          page={page}
          content={content}
          articleRef={articleRef}
          currentArticleData={currentArticleData}
          setCurrentArticleData={setCurrentArticleData}
        />
      )}

      {Tag === "line" && (
        <Separator 
            page={page}
            content={content} 
            articleRef={articleRef} 
        />
      )}
      {Tag === "paragraph" && (
        <EditableParagraph
          id={id}
          page={page}
          content={content}
          currentArticleData={currentArticleData}
          setCurrentArticleData={setCurrentArticleData}
        />
      )}
      {Tag === "title" && (
        <Title
          id={id}
          page={page}
          content={content}
          articleRef={articleRef}
          currentArticleData={currentArticleData}
          setCurrentArticleData={setCurrentArticleData}
        />
      )}
    </BlockContainer>
  );
}

export default forwardRef(Block);