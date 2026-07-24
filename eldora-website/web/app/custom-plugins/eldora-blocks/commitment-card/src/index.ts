import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { CommitmentCardBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<CommitmentCardBlock>, {
  parent: ["eldora/commitment-card-container"],
  edit: Edit,
  save: Save,
});
