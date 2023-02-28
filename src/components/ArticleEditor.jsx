import React, { useState, useRef, useEffect, onDragOver } from 'react';
import { RxCross2 } from 'react-icons/rx';
import styled from 'styled-components';
import BlockTypeToggle from './BlockTypeToggle';
import Block from './Block';

function ArticleEditor() {
  const [tag, setTag] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showIcon, setShowIcon] = useState(false);
  const [showTagOptions, setShowTagOptions] = useState(false);

    // 'currentArticleData' were created to initial tests

  const [currentArticleData, setCurrentArticleData] = useState([
    [
      {
      "id": 0,
      "type": "title",
      "content": "Veja quem está aqui! Bem-vindo ao teste da Atual"
      },
      {
        "id": 1,
        "type": "paragraph",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer ultricies id nunc vitae malesuada. Nam quis lacus eu orci consectetur congue quis quis turpis. Ut nec nunc condimentum, venenatis ex vel, semper arcu. Suspendisse in orci id sapien euismod lobortis. Pellentesque ac tortor vitae lorem fermentum dignissim sit amet eget mi. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus."
      },
      {
        "id": 2,
        "type": "img",
        "content": "https://atual.network/a54c57df2f849fb08c90f9214902aa5a/imgs/image-test.png"
      },
      {
        "id": 3,
        "type": "line"
      }
    ],
  ]);

  const iconsArray = [
    { name:'delete', type: <RxCross2 />, size: '20px', color: '#ff4d5085' } 
  ];

  const articleRef = useRef(null);
  const timeoutRef = useRef(null);
  const observerRef = useRef(null);
  const contentRef = useRef(null);
  const pageRef = useRef(null);

  const saveChanges = () => {
    if(!isEditing){
      console.log('Salvando alterações...');
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    const overIndex = findIndex(event.currentTarget);
    const sourceIndex = findIndex(event.dataTransfer.getData("text"));
    if (sourceIndex >= 0 && overIndex >= 0 && sourceIndex !== overIndex) {
      const newArticleData = [...currentArticleData];
      const [removed] = newArticleData.splice(sourceIndex, 1);
      newArticleData.splice(overIndex, 0, removed);
      setCurrentArticleData(newArticleData);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
  };

  const findIndex = () => {
    const el = articleRef.current;
    return [...el.parentNode.children].indexOf(el);
  };

  const handleMouseEnter = (id) => {
    setShowIcon(id);
  };

  const handleMouseLeave = () => {
    setShowIcon(null);
  };

  function deleteItem({pageIndex, itemId}){
    currentArticleData[pageIndex].splice(itemId, 1);
  }

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      saveChanges();
      setIsEditing(false);
    }, 5000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isEditing]);

  useEffect(() => {
    observerRef.current = new MutationObserver(() => {
      setIsEditing(true);
    });

    observerRef.current.observe(document, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
    });

    return () => {
      observerRef.current.disconnect();
    };
  }, []);

  return (
    <Article 
      ref={articleRef}
      onDragOver={handleDragOver} onDrop={handleDrop}
    >

      {
        currentArticleData.map(((page, pageIndex)=> {
          return(
            <ArticlePage ref={pageRef} key={`page.${pageIndex}`}>
              <Folder>
                <img src="https://atual.network/a54c57df2f849fb08c90f9214902aa5a/icons/folder.svg" />
                <p>Site / Categoria</p>
              </Folder>

              <PageContent ref={contentRef}>
                {
                  page.map((element, elementIndex) => {
                    return(
                      <ContainerBlock 
                      key={`container.${pageIndex}${element.id}`}
                        onMouseLeave={handleMouseLeave}
                        onMouseEnter={() => handleMouseEnter(element.id)} 
                      >
                          <Block 
                            id={`${element.id}`} 
                            pageRef={pageRef}
                            articleRef={articleRef} 
                            Tag={element.type} 
                            content={element.content} 
                            page={pageIndex}
                            currentArticleData={currentArticleData} 
                            setCurrentArticleData={setCurrentArticleData}
                          />
                        {(showIcon === element.id) && <ContainerIcons>
                          {
                            iconsArray.map(icon => {
                              return(
                                <Icons 
                                key={`icon.${pageIndex}${element.id}`}
                                size={icon.size}
                                color={icon.color}
                                  onClick={() => deleteItem({pageIndex, itemId: element.id})}
                                >
                                  {icon.type}
                                </Icons>
                              )
                            })
                          }
                        </ContainerIcons>}
                      </ContainerBlock>
                    );
                  })
                }

                { 
                  !isEditing &&
                  currentArticleData[currentArticleData.length -1][currentArticleData[currentArticleData.length -1].length -1].content && 
                    <Block 
                      Tag={tag} 
                      draggable={true} 
                      pageRef={pageRef} 
                      articleRef={articleRef} 
                    />
                }

                <Instruction onClick={() => setShowTagOptions(!showTagOptions)}>
                  Clique para adicionar um novo elemento
                </Instruction>

                {showTagOptions && ( <BlockTypeToggle
                  page={pageIndex}
                  showTagOptions={showTagOptions}
                  setShowTagOptions={setShowTagOptions}
                  currentArticleData={currentArticleData} 
                  setCurrentArticleData={setCurrentArticleData}
                  setTag={setTag}
                />)}
              </PageContent>
            </ArticlePage>
          )
        }))
      }
    </Article>
  );
}

export default ArticleEditor;

const Article = styled.div`
  height: 100%;
  width: 100%;
  z-index: 0;
  flex-wrap: wrap;
`;

const ArticlePage = styled.div`
  height: 270mm;
  width: 210mm;
  background-color: #FFFFFF;
  position: relative;
`;

const Folder = styled.div`
  height: 30px;
  width: 100%;
  display: grid;
  grid-template-columns: 15px 150px;
  grid-column-gap: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  p{
    margin: 0;
    text-align: left;
  }
`;

const PageContent = styled.div`
  width: 100%;
  padding: calc(3cm - 30px) 2cm 2cm 3cm;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: left;
`;

const Instruction = styled.p`
  text-align: left;
  margin-top: 20px;

  &:hover{
    cursor: pointer;
  }
`;

const ContainerIcons = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
`;

const ContainerBlock = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: relative;
  z-index: 0;
`;

const Icons = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  border-radius: 3px;
  justify-content: center;
  align-items: center;
  color: #FFFFFF;
  font-size: ${props => props.size};
  background-color: ${props => props.color};

  &:hover{
    color: '#ff4d50';
    cursor: pointer;
  }
`;