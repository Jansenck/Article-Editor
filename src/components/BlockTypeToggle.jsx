import { useRef, useEffect } from "react";
import styled from "styled-components";
import { RiSeparator } from "react-icons/ri";

function BlockTypeToggle(props) {


    const { page, setShowTagOptions, currentArticleData, setCurrentArticleData } = props;

    const toggleRef = useRef();

    const TagsInfo = [
      {
        type: 'Text',
        info: [
          {
            tag: 'paragraph',
            name: 'Parágrafo',
            instruction: 'Adicione um parágrafo ao texto',
            image: 'https://atual.network/a54c57df2f849fb08c90f9214902aa5a/icons/text.svg'
          }
        ]
      },
      {
        type: 'Basic',
        info: [
          {
            tag: 'img',
            name: 'Imagem',
            instruction: 'Envie uma imagem',
            image: 'https://atual.network/a54c57df2f849fb08c90f9214902aa5a/icons/image.svg'
          },
          {
            tag: 'line',
            name: 'Separador',
            instruction: 'Crie uma linha',
            image: <RiSeparator/>
          }
        ]
      }
    ];

    function AddElement(element, index){

      const newElement = {
        id: currentArticleData[index].length,
        type: element.tag,
        content: undefined
      };

      if(element.tag === 'line'){
        delete newElement.content;
      }
      currentArticleData[page] = [...currentArticleData[page], newElement]
  }

    useEffect(() => {
  
      function handleClickOutside(event) {
        const meuElemento = toggleRef.current;
    
        if (meuElemento && !meuElemento.contains(event.target)) {
          setShowTagOptions(false);
        }
      }
  
      document.addEventListener("mousedown", handleClickOutside);
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
  
    }, []);

    return(
        <TagOptions ref={toggleRef}>
          {
            TagsInfo.map((option, index) => {
              return(
                <Option key={index}>
                  <TypeOption>{option.type}</TypeOption>
                  {
                    option.info.map((element, index) => {
                      return(
                        <TagInfo 
                          id='unique'
                          key={index} 
                          onClick={() => AddElement(element, index)}
                        >
                          <ImageContainer>
                            {
                              typeof(element.image) === 'object'?
                                element.image
                                :
                                <img rel="icon" type="image/svg+xml" src={element.image} />
                            }
                          </ImageContainer>
                          <Infos>
                            <TagName>{element.name}</TagName>
                            <Instruction>{element.instruction}</Instruction>
                          </Infos>
                        </TagInfo>
                      )
                    })
                  }
                  <Separator></Separator>
                </Option>
              )
            })
          }
        </TagOptions>
    );
}

export default BlockTypeToggle;

const TagOptions = styled.div`
  width: 290px;
  border: 1px solid #7b7b7b2a;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  z-index: 1;
`;

const Option = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
`;

const TypeOption = styled.p`
  height: 30px;
  width: 100%;
  text-align: left;
  color: #7b7b7b;
`;

const TagInfo = styled.div`
  height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  text-align: left;
  gap: 12px;

  &:hover{
    background-color: #E1E1E1;
    width: 108%;
    padding: 10px;
    box-sizing: border-box;
    cursor: pointer;
  }
`;

const ImageContainer = styled.div`
  height: 30px;
  width: 30px;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: center;
  align-items: center;
  justify-content: center;
  color: #68d2af;
  
  img{
    height: 20px;
    width: 20px;
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
`;

const TagName = styled.p`
  color: #3E3E3E;
`;

const Infos = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Instruction = styled.p`
  width: 100%;
`;

const Separator = styled.div`
  width: 90%;
  border: 1px solid #F1F1F1;
`;