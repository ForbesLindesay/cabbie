import renderMethod from './render-method';

function renderEntrypoint(data, context) {
  return {
    path: ``,
    getContent() {
      console.dir(data, {depth: 2, colors: true});
      return `
        <h1>cabbie-${context.mode}</h1>
        ${renderMethod(data.exports.default, context)}
        ${renderMethod(data.exports.getSessions, context)}
        ${renderMethod(data.exports.getStatus, context)}
      `;
    },
  };
}
export default renderEntrypoint;
