window.onload = function() {
    tinymce.init({
      selector: "textarea#tiny-mce-post-body",
    //   plugins: [
    //     "a11ychecker advcode advlist lists link checklist autolink autosave code",
    //     "preview",
    //     "searchreplace",
    //     "wordcount",
    //     "media table emoticons image imagetools",
    //   ],
      toolbar:
        "bold italic underline strikethrough | alignleft aligncenter alignright alignjustify| numlist bullist indent outdent | link image media | forecolor backcolor emoticons | code preview",
        plugins:
          "mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
      //   toolbar:
      //     "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
      height: 300,
      relative_urls: false,
      automatic_uploads: true,
      images_upload_url: "/uploads/postimage",
      images_upload_handler: function (blobInfo, success, failure) {
        let headers = new Headers();
        headers.append("Accept", "Application/JSON");

        let formData = new FormData();
        formData.append("post-image", blobInfo.blob(), blobInfo.filename());

        let req = new Request("/uploads/postimage", {
          method: "POST",
          headers,
          mode: "cors",
          body: formData,
        });

        fetch(req)
          .then((res) => res.json())
          .then((data) => success(data.imgUrl))
          .catch(() => failure("HTTP Error"));
      },
    });
}