import { useEffect, useState, useRef } from "react";
import styled from "styled-components";

function Title(props){

    const { id, currentArticleData, setCurrentArticleData } = props;

    const textAreaRef = useRef(null);
    const titleRef = useRef(null);

    const [title, setTitle] = useState(null);
    const [editingTitle, setEditingTitle] = useState(false);
    const [textHeight, setTextHeight] = useState(null);

    function handleInputChange(event) {

        if(editingTitle){
            const updatedContent = currentArticleData.map(item => {
                if(item.id === id){
                    return { ...item, content: event.target.value }
                }
                return item;
            });
            setCurrentArticleData(updatedContent);
        }
    }
    
    function handleKeyDown(event) {
    if (event.key === "Enter") {
        event.target.blur();
        setEditingTitle(false);
    }
    }

    useEffect(() => {
        setTitle(props.content);
    }, [props.content]);

    useEffect(() => {
        function handleClickOutside(event) {
          const textarea = textAreaRef.current;
    
          if (textarea && !textarea.contains(event.target)) {
            setEditingTitle(false);
          }
        }
    
        document.addEventListener("mousedown", handleClickOutside);
    
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setTitle(props.content);
        if(textAreaRef.current){
            const elementHeight = textAreaRef.current.scrollHeight -1;
            setTextHeight(`${elementHeight}px`);
        }
    }, [title]);
    
      useEffect(() => {
        if(titleRef.current){
            const elementHeight = titleRef.current.getBoundingClientRect().height;
            setTextHeight(`${elementHeight}px`);
        }
      }, [titleRef.current]);

    return(
            editingTitle || !title?
                <InputTitle
                    ref={textAreaRef}
                    type="text"
                    height={textHeight}
                    value={props.content || title}
                    placeholder='Digite o titulo aqui'
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onClick={() => setEditingTitle(true)}
                />
                :
                <ArticleTitle 
                    ref={titleRef}
                    height={textHeight}
                    draggable={true}
                    onClick={() => setEditingTitle(true)}
                >
                    {props.content? props.content : texto}
                </ArticleTitle>
    );
}

export default Title;

const InputTitle = styled.textarea`
    font-family: 'Source Serif Pro', serif;
    color: #232323;
    font-size: 25px;
    text-align: left;
    margin-bottom: 40px;
    border-style: none;
    text-align: left;
    display: flex;
    flex-direction: column;
    box-sizing: content-box;
    text-align: justify;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    overflow-y: hidden;
    resize: none;
    height: ${props => props.height? props.height : ''};
`;

const ArticleTitle = styled.h1`
    color: #232323;
    font-size: 25px;
    text-align: left;
    margin-bottom: 40px;
    display: flex;
    flex-direction: column;
    box-sizing: content-box;
    text-align: justify;
    -webkit-hyphens: auto;
    -moz-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
`;