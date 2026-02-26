import React from 'react';
import data from './data.json';

function App() {
  const { siteInfo, sections } = data;

  return (
    <div className="min-h-screen font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* 顶部 Hero 区域：暖色渐变背景 */}
      <header className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-[#FDFBF7] pt-20 pb-24 px-4 border-b border-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block p-1 rounded-full bg-white shadow-sm mb-6">
            <img 
              src={siteInfo.avatar} 
              alt="avatar" 
              className="w-24 h-24 rounded-full border-4 border-white shadow-inner" 
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-stone-800 tracking-tight mb-4">
            {siteInfo.title}
          </h1>
          <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed">
            {siteInfo.description}
          </p>

          {/* 快捷导航 */}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            {sections.map(section => (
              <a 
                key={section.id} 
                href={`#${section.id}`}
                className="px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-sm border border-stone-200 text-stone-600 text-sm font-medium hover:bg-amber-100 hover:text-amber-800 hover:border-amber-200 transition-all shadow-sm"
              >
                {section.title}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="max-w-5xl mx-auto px-6 -mt-12 space-y-20 pb-24 relative z-10">
        {sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            {/* 分区标题 */}
            <div className="mb-8 flex items-end justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
                  <span className="text-amber-500">{section.title.split(' ')[0]}</span>
                  <span>{section.title.split(' ')[1]}</span>
                </h2>
                <p className="text-stone-400 text-sm mt-1">{section.desc}</p>
              </div>
              <span className="hidden md:block text-xs font-mono text-stone-300 bg-stone-50 px-2 py-1 rounded">
                {section.type.toUpperCase()}
              </span>
            </div>
            
            {/* 卡片网格 */}
            <div className={`grid gap-6 ${
              section.type === 'link' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
              section.type === 'image' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
              'grid-cols-1 md:grid-cols-2'
            }`}>
              {section.items.map((item, index) => (
                <Card key={index} type={section.type} item={item} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* 底部 */}
      <footer className="bg-stone-50 border-t border-stone-100 py-12 text-center">
        <p className="text-stone-400 text-sm">
          Designed with <span className="text-red-400">♥</span> by {siteInfo.title}
        </p>
      </footer>
    </div>
  );
}

// 通用卡片组件
function Card({ type, item }) {
  const openLink = () => window.open(item.url, '_blank');

  // 1. 链接卡片
  if (type === 'link') {
    return (
      <div 
        onClick={openLink}
        className="group relative bg-white rounded-2xl p-6 border border-stone-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(251,191,36,0.15)] hover:border-amber-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col h-full"
      >
        <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg font-bold">
            {item.title.charAt(0)}
          </div>
          {item.tag && <span className="text-[10px] font-bold tracking-wider text-amber-600/80 bg-amber-50/50 px-2 py-1 rounded-md uppercase">{item.tag}</span>}
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h3>
        <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
      </div>
    );
  }

  // 2. 视频卡片
  if (type === 'video') {
    return (
      <div className="bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-md transition-all group">
        <div className="aspect-video bg-stone-900 relative">
          <video controls className="w-full h-full object-contain" src={item.url} poster={item.poster || ''}>
             Your browser does not support the video tag.
          </video>
        </div>
        <div className="p-5">
          <h3 className="font-bold text-stone-800 mb-1 group-hover:text-amber-600 transition-colors">{item.title}</h3>
          <p className="text-xs text-stone-400">{item.desc}</p>
        </div>
      </div>
    );
  }

  // 3. 图片卡片
  if (type === 'image') {
    return (
      <div className="group break-inside-avoid mb-6 bg-white rounded-2xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500">
        <div className="aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer relative" onClick={() => window.open(item.url, '_blank')}>
          <div className="absolute inset-0 bg-amber-900/0 group-hover:bg-amber-900/10 z-10 transition-colors duration-300"></div>
          <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-stone-800 group-hover:text-amber-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-stone-400 mt-1">{item.date}</p>
            </div>
          </div>
          <p className="text-sm text-stone-500 mt-3 line-clamp-2">{item.desc}</p>
        </div>
      </div>
    );
  }

  // 4. 文档卡片
  return (
    <div className="group bg-white rounded-2xl p-5 border border-stone-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all flex items-start gap-5">
      <div className="shrink-0 p-4 bg-[#FFF4E6] text-[#FF9500] rounded-xl group-hover:scale-110 transition-transform duration-300">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
      </div>
      <div className="flex-grow min-w-0 py-1">
        <h3 className="text-lg font-bold text-stone-800 truncate group-hover:text-amber-600 transition-colors" title={item.title}>{item.title}</h3>
        <p className="text-sm text-stone-500 mt-1 mb-3 line-clamp-2">{item.desc}</p>
        <div className="flex items-center gap-4">
          <a href={item.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-full transition-colors">
            在线预览
          </a>
          <a href={item.url} download className="text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors">
            下载文件
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;