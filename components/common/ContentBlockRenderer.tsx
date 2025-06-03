export const ContentBlockRenderer = ({ block }: { block: any }) => {
  switch (block.type) {
    case "paragraph": // Using dangerouslySetInnerHTML because RichEditor outputs HTML. Sanitize if needed.
      return <div dangerouslySetInnerHTML={{ __html: block.data.text }} />;

    case "subheading":
      const Tag = block.data.level || "h2"; // Default to h2 if level not set

      return <Tag>{block.data.text}</Tag>; // Add cases for other block types you define (hero, image_gallery, etc.)

    default:
      console.warn("Unsupported block type:", block.type);

      return null;
  }
};
