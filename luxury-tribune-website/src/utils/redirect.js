import Router from 'next/router';

const Redirect = (res, page) => {
  if (res) {
    res.writeHead(302, {
      Location: page,
    });
    res.end();
  } else {
    Router.push(page);
  }

  return {};
};
export default Redirect;
