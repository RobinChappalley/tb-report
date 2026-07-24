import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { TestimonialBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";

registerBlockType(metadata as BlockConfiguration<TestimonialBlock>, {
  edit: Edit,
});
