const handleDownloadAttachment = (attachmentId, fileName) => {
    try {
        const response = api.get(`recruitments/${recruitmentsId}/attachments`,
            { responseType: 'blob' }
        );
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error('첨부파일 다운로드 실패:', error);
    }
};
    };
