import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

import Icon from '../Icon/Icon';

const Alert = ({ message, type, handleClose }) => (
  <AnimatePresence>
    <motion.div
      className={`alert alert-${type} fixed top-0 left-0 w-full p-20 text-white flex justify-between items-center`}
      initial={{ opacity: 0, y: '-100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '-100%' }}
      transition={{ duration: 1 }}
    >
      <div className="text-15 leading-22 font-soehneKraftig">
        <p>{message}</p>
      </div>

      <button
        className="text-white"
        type="button"
        onClick={handleClose}
        aria-label="Close"
      >
        <Icon name="close" />
      </button>
    </motion.div>
  </AnimatePresence>
);

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  handleClose: PropTypes.func,
};

Alert.defaultProps = {
  message: '',
};

export default Alert;
