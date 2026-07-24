import { registerBlockType, BlockConfiguration } from '@wordpress/blocks';
import { FullScreenImageBlock } from './types/block';

import Edit from './components/Edit';
import metadata from './block.json';
import Save from "./components/Save";

registerBlockType(
  metadata as BlockConfiguration<FullScreenImageBlock>,
  {
    edit: Edit,
    save: Save,
  },
);
