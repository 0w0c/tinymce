import { Element, Css } from '@ephox/sugar';
import { console, window, document } from '@ephox/dom-globals';

declare let tinymce: any;

export default function () {

  const makeSidebar = (ed, name: string, background: string, width: number) => {
    ed.ui.registry.addSidebar(name, {
      icon: 'comment',
      tooltip: 'Tooltip for ' + name,
      onSetup: (api) => {
        const box = Element.fromHtml('<div style="width: ' + width + 'px; background: ' + background + ';"></div>');
        api.element().appendChild(box.dom());
        return () => {
          api.element().removeChild(box.dom());
        };
      },
      onShow: (api) => {

      },
      onHide: (api) => {

      },
    });
  };

  const settings = {
    skin_url: '../../../../js/tinymce/skins/ui/oxide',
    content_css: '../../../../js/tinymce/skins/content/default/content.css',
    images_upload_url: 'd',
    selector: '#ephox-ui textarea',
    // rtl_ui: true,
    link_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_list: [
      { title: 'My page 1', value: 'http://www.tinymce.com' },
      { title: 'My page 2', value: 'http://www.moxiecode.com' }
    ],
    image_class_list: [
      { title: 'None', value: '' },
      { title: 'Some class', value: 'class-name' }
    ],
    importcss_append: true,
    height: 400,
    file_picker_callback (callback, value, meta) {
      // Provide file and text for the link dialog
      if (meta.filetype === 'file') {
        callback('https://www.google.com/logos/google.jpg', { text: 'My text' });
      }

      // Provide image and alt text for the image dialog
      if (meta.filetype === 'image') {
        callback('https://www.google.com/logos/google.jpg', { alt: 'My alt text' });
      }

      // Provide alternative source and posted for the media dialog
      if (meta.filetype === 'media') {
        callback('movie.mp4', { source2: 'alt.ogg', poster: 'https://www.google.com/logos/google.jpg' });
      }
    },
    spellchecker_callback (method, text, success, failure) {
      const words = text.match(this.getWordCharPattern());

      if (method === 'spellcheck') {
        const suggestions = {};

        for (let i = 0; i < words.length; i++) {
          suggestions[words[i]] = ['First', 'Second'];
        }

        success(suggestions);
      }

      if (method === 'addToDictionary') {
        success();
      }
    },
    templates: [
      { title: 'Some title 1', description: 'Some desc 1', content: 'My content' },
      { title: 'Some title 2', description: 'Some desc 2', content: '<div class="mceTmpl"><span class="cdate">cdate</span><span class="mdate">mdate</span>My content2</div>' }
    ],
    template_cdate_format: '[CDATE: %m/%d/%Y : %H:%M:%S]',
    template_mdate_format: '[MDATE: %m/%d/%Y : %H:%M:%S]',
    image_caption: true,
    theme: 'silver',
    mobile: {
      theme: 'silver',
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste'
      ],
      toolbar: 'fullscreen bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image insertfile undo redo | styleselect'
    },
    setup (ed) {
      makeSidebar(ed, 'sidebar1', 'green', 200);
    },
    plugins: [
      'help'
      // 'autosave advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker toc',
      // 'searchreplace wordcount visualblocks visualchars code fullscreen fullpage insertdatetime media nonbreaking',
      // 'save table directionality emoticons template paste textcolor importcss colorpicker textpattern',
      // 'codesample help noneditable print'
    ],
    // rtl_ui: true,
    add_unload_trigger: false,
    autosave_ask_before_unload: false,
    toolbar: 'undo redo fullscreen sidebar1 align fontsizeselect fontselect formatselect styleselect insertfile | styleselect | bold italic | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons table codesample code | ltr rtl',

    // Multiple toolbar array
    // toolbar: ['undo redo sidebar1 align fontsizeselect insertfile | fontselect formatselect styleselect insertfile | styleselect | bold italic',
    // 'alignleft aligncenter alignright alignjustify | print preview media fullpage | forecolor backcolor emoticons table codesample code | ltr rtl',
    // 'bullist numlist outdent indent | link image'],

    // Toolbar<n>
    // toolbar1: 'undo redo sidebar1 align fontsizeselect insertfile | fontselect formatselect styleselect insertfile | styleselect | bold italic',
    // toolbar2: 'alignleft aligncenter alignright alignjustify | print preview media fullpage | forecolor backcolor emoticons table codesample code | ltr rtl',
    // toolbar3: 'bullist numlist outdent indent | link image',

    // Toolbar with group names
    // toolbar: [
    //   {
    //     name: 'history', items: [ 'undo', 'redo' ]
    //   },
    //   {
    //     name: 'styles', items: [ 'styleselect' ]
    //   },
    //   {
    //     name: 'formatting', items: [ 'bold', 'italic']
    //   },
    //   {
    //     name: 'alignment', items: [ 'alignleft', 'aligncenter', 'alignright', 'alignjustify' ]
    //   },
    //   {
    //     name: 'indentatπion', items: [ 'outdent', 'indent' ]
    //   },
    //   {
    //     name: 'permanent pen', items: [ 'permanentpen' ]
    //   },
    //   {
    //     name: 'comments', items: [ 'addcomment' ]
    //   }
    // ],
    toolbar_drawer: 'sliding',
    emoticons_database_url: '/src/plugins/emoticons/main/js/emojis.js',
    init_instance_callback: (editor) => {

      // TODOS
      // detect flick scroll, see where touch end is above or below touch start, bypass touchmove
      // see if we can disable animation on scrolltop
      // android disable overscroll via CSS -> testing

      const rubberBand = 50;

      const touchdirection = (editor) => {
        // Load this when touch device is detected
        const start = { x: 0, y: 0 };

        editor.on('touchstart', (e) => {
          start.x = e.touches[0].pageX;
          start.y = e.touches[0].pageY;
        });

        editor.on('touchend', (e) => {
          const flickDelta = { x: 0 , y: 0 };

          flickDelta.x = start.x - e.pageX;
          flickDelta.y = start.y - e.pageY;

          const vertical = flickDelta.y > 0;
          const horizontal = flickDelta.x > 0;

          // TODO: test these events
          editor.fire(vertical ? 'flickdown' : 'flickup');
          editor.fire(horizontal ? 'flickleft' : 'flickright');

          // TODO: redraw visual viewport, perhaps an animate to smoothen out the rubber band back.
        });

        // todo - this only captures content, we need to capture on toolbar and footerbar also...perhaps a higher level delegation
        editor.on('touchmove', (e) => {
          const delta = { x: 0 , y: 0 };

          delta.x = start.x - e.touches[0].pageX;
          delta.y = start.y - e.touches[0].pageY;

          const vertical = delta.y > 0;
          const horizontal = delta.x > 0;

          // TODO: test these events
          editor.fire(vertical ? 'swipedown' : 'swipeup');
          editor.fire(horizontal ? 'swipeleft' : 'swiperight');
        });
      };

      const bod = Element.fromDom(document.body);
      // todo: revert to previous styles when exit from mobile fullscreen, see Thor attr backups
      Css.setAll(bod, {
        padding: rubberBand + 'px 0',
        margin: '0'
      });

      touchdirection(editor);

      editor.on('swipedown flickdown', (e) => {
        // console.log(window.document.body.scrollTop, window.document.body.scrollHeight);
        // console.log(window.document.documentElement.scrollTop , window.document.documentElement.scrollHeight);
        window.requestAnimationFrame(() => {
            console.log('down', window.document.documentElement.scrollTop, window.document.body.scrollTop, Date());

            /* tslint:disable-next-line:no-string-literal */
            const visualViewport = window['visualViewport'];
            const bodyRect = window.document.body.getClientRects();

            if (window.document.documentElement.scrollTop >= window.document.documentElement.scrollHeight - bodyRect[0].height) {
              // We are in a good peaceful place, do nothing
              console.log('down noop');
            } else {
              console.log('setscroll');
              // TODO: future bug, when we are nested in another iframe, we'd have to scroll that to the extremity also.
              // we don't scroll to the very end of the <html>, so theres room in their for rubber band effect
              window.document.documentElement.scrollTop = window.document.documentElement.scrollHeight - visualViewport.height;
            }

            // scroll the content to the extremity
            window.document.body.scrollTop = window.document.body.scrollHeight;
        });
      });

      editor.on('swipeup flickup', (e) => {

        if (window.document.documentElement.scrollTop <= rubberBand) {
          console.log('up noop');
        } else {
          window.document.documentElement.scrollTop = rubberBand;
          console.log('up', window.document.documentElement.scrollTop, window.document.body.scrollTop);
        }

        window.document.body.scrollTop = 0;

      });

    }
  };

  tinymce.init(settings);
  // tinymce.init(Merger.deepMerge(settings, { inline: true, selector: 'div.tinymce' }));
}