import { useFormikContext } from "formik";
import { ChangeEvent, useState } from "react"

export default function ImageField(props: imageFieldProps) {

    const [imageBase64, setImageBase64] = useState(''); // imageBase64 is only for preview
    const [imageURL, setImageURL] = useState(props.imageURL); // return url
    const { values } = useFormikContext<any>();

    const divStyle = { marginTop: '10px' };
    const imgStyle = { width: '450px' };

    const handleOnChange = (eventsArgs: ChangeEvent<HTMLInputElement>) => {
        if (eventsArgs.currentTarget.files) {
            const file = eventsArgs.currentTarget.files[0]; //accept 1 file 
            if (file) {
                toBase64(file)
                    .then((base64Representation: string) => setImageBase64(base64Representation))
                    .catch(error => console.error(error));
                values[props.field] = file;
                setImageURL('');
            } else {
                setImageBase64('');
            }
        }
    }

    //change Base64 string from file
    const toBase64 = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        })
    }

    return (
        <div className="mb-3">
            <label>{props.displayName}</label>
            <div>
                <input type="file" accept=".jpg,.jpeg,.png" onChange={handleOnChange} />
            </div>
            {imageBase64 ?
                <div>
                    <div style={divStyle}>
                        <img style={imgStyle} src={imageBase64} alt="selected" />
                    </div>
                </div> : null}
            {imageURL ?
                <div>
                    <div style={divStyle}>
                        <img style={imgStyle} src={imageURL} alt="selected" />
                    </div>
                </div> : null}
        </div>
    )
}

interface imageFieldProps {
    displayName: string;
    imageURL: string;
    field: string;
}

ImageField.defaultProps = {
    imageURL: ''
}


/*
                                imageBase64

Purpose: imageBase64 is used to store the Base64-encoded representation of an image file 
that the user selects using the file input.

Usage: This state is specifically for previewing the selected image 
within the component before the form is submitted. 
When a user selects an image file, the file is converted to a Base64 string, 
which is then stored in imageBase64. The component uses this Base64 string 
to display a preview of the image.


                                imageURL

Purpose: imageURL is used to store the URL of an existing image that might be provided 
as a prop when the component is initially rendered.

Usage: This state is useful for scenarios where an image already exists 
and needs to be displayed, such as when editing an existing record with 
a previously uploaded image. The component uses this URL to display the existing image. 
If the user selects a new image, imageURL is cleared 
to ensure the new image preview (from imageBase64) is displayed instead.

*/