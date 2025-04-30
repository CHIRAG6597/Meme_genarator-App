import { useState, useEffect } from "react"
import { useRef } from "react";
//import html2canvas from "html2canvas"; // This is not working
import domtoimage from 'dom-to-image';

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "Enter your meme text",
        bottomText: "Enter the text",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    })
    const [allMemes, setAllMemes] = useState([])
    const memeRef = useRef(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes))
    }, [])

    //below function is called when the button is clicked
    //it generates a random number and sets the imageUrl to a random meme
    //from the allMemes array
    //it uses the setMeme function to update the state
    //it uses the prevMeme parameter to get the previous state
    //it uses the (...) spread operator to copy the previous state
    //it uses the newMemeUrl variable to set the imageUrl
    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length)
        const newMemeUrl = allMemes[randomNumber].url
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }))
    } 
    //below function is called when the download button is clicked
    //it uses the html2canvas library to take a screenshot of the memeRef
    //it uses the toBlob method to convert the canvas to a blob
    //it uses the createObjectURL method to create a URL for the blob
    //it uses the a element to download the image
    // below function is commented out because it is not working
    // const downloadMeme = () => {
    //     html2canvas(memeRef.current).then((canvas) => {
    //       const link = document.createElement("a");
    //       link.download = "my-meme.png";
    //       link.href = canvas.toDataURL();
    //       link.click();
    //     });
    //   };
    const downloadMeme = () => { 
        // Use dom-to-image to convert the memeRef to an image
        // and download it as a PNG file
        const img = memeRef.current;
      
        domtoimage.toPng(img)
        // Convert the img to a PNG image
        // and return a promise
        // that resolves with the data URL
        // and download it
          .then((dataUrl) => { 
            // Create a link element
            // and set the download attribute
            // to the desired file name
            // and set the href attribute to the data URL
            // and trigger a click event on the link
            const link = document.createElement('a');
            link.download = 'my-meme.png';
            link.href = dataUrl;
            link.click();
          })
          .catch((error) => {
            console.error('Image download failed!', error);
          });
      };

    function handleChange(event) {
        const { value, name } = event.currentTarget
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }))
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div> 
            <div ref={memeRef} className="meme">
                <img src={meme.imageUrl} alt="meme" className="meme-image" crossOrigin="anonymous" />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
            </div>
            <button className="download" onClick={downloadMeme}>Download Meme ⬇️</button>
        </main>
    )
}