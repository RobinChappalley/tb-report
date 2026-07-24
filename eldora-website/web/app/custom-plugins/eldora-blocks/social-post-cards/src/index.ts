import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { SocialPostCardsBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";

registerBlockType(metadata as BlockConfiguration<SocialPostCardsBlock>, {
  edit: Edit,
});
