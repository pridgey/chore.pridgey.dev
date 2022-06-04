import style from "./ImageBanner.module.css";

type ImageBannerProps = {
  ImageSrc: string;
  Text: string;
};

export const ImageBanner = (props: ImageBannerProps) => {
  const { banner, title } = style;

  return (
    <div
      class={banner}
      style={{ "background-image": `url('./${props.ImageSrc}')` }}
    >
      <h1 class={title}>{props.Text}</h1>
    </div>
  );
};
