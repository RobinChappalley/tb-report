import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { CommitmentCardContainerBlock } from "./types/block";

import metadata from "./block.json";
import Edit from "./components/Edit";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<CommitmentCardContainerBlock>, {
  edit: Edit,
  save: Save,
});
