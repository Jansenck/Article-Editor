import { useState, useEffect, useRef } from "react";
import styled from "styled-components";

function Image(props) {
  const { id, page, currentArticleData, setCurrentArticleData } = props;

  const [image, setImage] = useState(undefined);
  const [changeImage, setChangeImage] = useState(true);
  const [containerImageWidth, setContainerImageWidth] = useState(200);
  const [containerImageHeight, setContainerImageHeight] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const [mouseX, setMouseX] = useState(null);
  const [mouseY, setMouseY] = useState(null);

  const imageRef = useRef(undefined);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    file && file.type.startsWith("image/")
      ? (reader.readAsDataURL(file),
        (reader.onloadend = () => {
          setImage(reader.result);
          setChangeImage(false);
        }))
      : alert("Por favor, selecione apenas imagens!");
  }; 

  const ondragStart = (event) => {
    event.dataTransfer.setData("text/plain", id);
  };

  const handleMouseDown = (event) => {
    setIsResizing(true);
    setMouseX(event.clientX);
    setMouseY(event.clientY);
  };

  const handleMouseMove = ({ clientX, clientY }) => {
    if (!isResizing) {
      return;
    }
    const newWidth = containerImageWidth + clientX - mouseX;
    const newHeight = containerImageHeight + clientY - mouseY;
    setContainerImageWidth(newWidth);
    setContainerImageHeight(newHeight);
    setMouseX(clientX);
    setMouseY(clientY);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (!image) {
      return;
    }
  
    setCurrentArticleData((prev) =>
      prev.map((pageData, indexPage) =>
        indexPage === page
          ? pageData.map((item) =>
              item.type === "img" && item.content === undefined
                ? { ...item, id: pageData.length - 1, content: image }
                : item
            )
          : pageData
      )
    );
  }, [image, setCurrentArticleData, page]);
  

  useEffect(() => {
    setImage(props.content);
    setChangeImage(false);
  }, [props.content]);

  return (
    <>
      {changeImage || image === undefined ? (
        <Form>
          <Input type="file" onChange={handleImageUpload} />
        </Form>
      ) : (
        <ImageWrapper
            ref={imageRef}
            draggable={true}
            width={containerImageWidth}
            height={containerImageHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onDragStart={(event) => ondragStart(event)}
            onClick={() => setChangeImage(!changeImage)}>
          <ArticleImage
            alt="Imagem"
            src={image}
            value={image}
          />
        </ImageWrapper>
      )}
    </>
  );
}


export default Image;

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block;
  margin-bottom: 40px;
  background-color: blue;
`;

const ArticleImage = styled.img`
  height: 200px; 
  width: 100%;
  display: block;
  height: auto;
  
`;

const Input = styled.input`
  width: 500px;
`;

const Form = styled.div`
  height: 35px;
  width: 70%;
`;