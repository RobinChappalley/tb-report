import { registerBlockType, BlockConfiguration } from "@wordpress/blocks";
import { ImageMetricsNumberBlock } from "./types/block";

import Edit from "./components/Edit";
import metadata from "./block.json";
import Save from "./components/Save";

registerBlockType(metadata as BlockConfiguration<ImageMetricsNumberBlock>, {
  edit: Edit,
  save: Save,
  parent: ["eldora/image-metrics"],
});
