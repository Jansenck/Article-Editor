import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";

function EditableParagraph(props) {
  const { page, setCurrentArticleData, currentArticleData, id } = props;

  const [text, setText] = useState(props.content || '');
  const [editingText, setEditingText] = useState(false);
  const [textHeight, setTextHeight] = useState(null);
  const [textAreaHeight, setTextAreaHeight] = useState(null);

  const textAreaRef = useRef(null);
  const textRef = useRef(null);

  const ondragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
  };

  function changeStatusText(){
    setEditingText(true);
    textAreaRef.current.focus();
    textAreaRef.current.selectionStart = textAreaRef.current.selectionEnd = text.length;
  }

  function handleClickOutside(event) {
    const textarea = textAreaRef.current;
    if (textarea && !textarea.contains(event.target)) {
      setTextAreaHeight(textAreaRef.current?.scrollHeight);
      if (!editingText) {
        const updatedContent = currentArticleData.map((pageData, indexPage) => {
          if (indexPage === page) {
            return pageData.map((item) => {
              if (item.type === 'paragraph' && item.content === undefined) {
                return { ...item, id: pageData.length -1, content: textAreaRef.current.textContent };
              }
              return item;
            });
          } else {
            return pageData;
          }
        });
        setCurrentArticleData(updatedContent);
      }
      setEditingText(false);
    }
  }

  function handleKeyDown(event) {
  if (event.key === "Enter") {
    setEditingText(false);
  }
}

  
  useEffect(() => {
    if (textRef.current) {
      const elementHeight = textRef.current?.getBoundingClientRect().height;
      setTextHeight(`${elementHeight}px`);
    }
  }, [textRef.current]);

  useEffect(() => {
    setTextAreaHeight(textAreaRef.current?.scrollHeight);
  }, [props.content, text]);

  useEffect(() => {

    return () => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
  
  }, [editingText, text]);

  return editingText || text === '' ? (
    <Input
      type="text"
      value={text}
      ref={textAreaRef}
      height={textAreaHeight}
      placeholder="Digite o texto aqui"
      onChange={(event) => setText(event.target.value)}
      onKeyDown={handleKeyDown}
      onClick={changeStatusText}
    />
  ) : (
    <Text
      key={id}
      ref={textRef}
      draggable={true}
      height={textHeight}
      onDragStart={(event) => ondragStart(event)}
      onClick={() => setEditingText(true)}
    >
      {text}
    </Text>
  );
}

export default EditableParagraph;

const Input = styled.textarea`
  width: 100%;
  margin-bottom: 40px;
  border-style: none;
  font-size: 12px;
  text-align: left;
  font-family: 'Source Serif Pro', serif;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
  resize: none;
  overflow-y: hidden;
  height: ${props => props.height ? `${props.height}px` : 'auto'};
  word-wrap: break-word;
  max-width: 605px;
`;

const Text = styled.p`
  width: 100%;
  margin-bottom: 40px;
  font-size: 12px;
  text-align: left;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;
  text-align: justify;
  -webkit-hyphens: auto;
  -moz-hyphens: auto;
  -ms-hyphens: auto;
  hyphens: auto;
`;
