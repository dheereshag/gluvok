const shareContent = (content) => {
  if (navigator.share) {
    navigator
      .share({
        title: content.title,
        text: content.text,
        url: content.url,
      })
      .catch((error) => {
        console.error("Something went wrong sharing the content", error);
      });
  } else {
    console.warn("Your device does not support the Web Share API");
  }
};

export default shareContent;
