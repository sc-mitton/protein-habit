import { Image, ImageProps } from "expo-image";
import { Component } from "react";

// const fallback =
//   "https://protein-count-recipe-thumbnails.s3.us-west-1.amazonaws.com/a3d4e7c9-4f85-4d8e-bfde-1e3f6d8b0986.jpg";

export class RecipeThumbnail extends Component<ImageProps> {
  render() {
    const { source, ...props } = this.props;
    const uri = source?.uri;
    return <Image source={{ uri }} {...props} />;
  }
}
