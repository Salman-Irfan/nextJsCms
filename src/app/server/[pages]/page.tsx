import getPageContentService from '@/services/apiServices/getPageContentService/getPageContentService';
import React from 'react';

const Page = async (props: any) => {
    const slugName = props.params.pages;

    let pageRecords = null;

    try {
        const response = await getPageContentService(slugName);
        pageRecords = response.data.pageRecords;
    } catch (error) {
        console.error(error);
    }


    return (
        <>
            <html>
                {
                    pageRecords && (
                        <>
                            <meta name="description" content={pageRecords[0].seo_description} />
                            <meta name="keywords" content={pageRecords[0].seo_keywords} />
                            <title>{`KHUDI - ${pageRecords[0].seo_title}`}</title>
                        </>
                    )
                }
            </html>
            <div>
                {pageRecords && (
                    <>
                        <p>Page Titles: {pageRecords[0].page_title}</p>
                        <div
                            dangerouslySetInnerHTML={{
                                __html: pageRecords[0].page_content,
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default Page;
