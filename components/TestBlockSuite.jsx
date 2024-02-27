import '@blocksuite/presets/themes/affine.css';

import { createEmptyPage, DocEditor } from '@blocksuite/presets';
import { Text } from '@blocksuite/store';
import { useEffect, useRef } from 'react';

const TestBlockSuite = () => {
  const editorElemRef = useRef(null);

  useEffect(() => {
    const initEditor = async () => {
      // Init editor with default block tree
      const page = await createEmptyPage().init();
      const editor = new DocEditor();

      // Update block node with some initial text content
      const paragraphs = page.getBlockByFlavour('affine:paragraph');
      const paragraph = paragraphs[0];
      page.updateBlock(paragraph, { text: new Text('Hello World!') });

      // Adding the page to editor
      editor.page = page;

      // Adding editor to the ref
      if (editorElemRef.current) {
        editorElemRef.current.innerHTML = '';
        editorElemRef.current.appendChild(editor);
      }
    };

    initEditor();
  }, []);

  return <div style={{ height: '100vh' }} ref={editorElemRef} />;
};

export default TestBlockSuite;
