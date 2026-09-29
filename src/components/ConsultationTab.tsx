import React, { useState } from 'react';
import { ShieldCheck, Send, Stethoscope, AlertTriangle, CheckCircle2, ChevronRight, User } from 'lucide-react';
import { Product, PharmacistMessage } from '../types';

interface ConsultationTabProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ConsultationTab: React.FC<ConsultationTabProps> = ({
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [messages, setMessages] = useState<PharmacistMessage[]>([
    {
      id: 'm1',
      sender: 'pharmacist',
      content: '您好！我是值班执业药师（国家认证执业药师编号：11029481）。请问您或家人近期有什么健康疑问、用药困惑或保健品搭配需求吗？',
      time: '09:40'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const presetQuestions = [
    '深海鱼油能和降脂药一起吃吗？有禁忌吗？',
    '父母有轻度高血压，推荐什么日常监测设备？',
    '经常熬夜加班、心慌胸闷，吃什么调理好？',
    '50岁以上长辈体检套餐应该重点查哪些项目？'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: PharmacistMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      content: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Pharmacist intelligent response based on keywords
    setTimeout(() => {
      let replyContent = '';
      let suggestedIds: string[] = [];

      if (text.includes('鱼油') || text.includes('降脂') || text.includes('血管')) {
        replyContent = '深海高纯度鱼油（EPA+DHA≥90%）对辅助降低甘油三酯很有益处。若正在服用他汀类降脂西药，通常可以协同配合，但建议与降脂药间隔1-2小时服用。另外，有凝血障碍或服用抗凝药（如华法林、阿司匹林）的患者，需注意监测凝血指标。';
        suggestedIds = ['prod_1'];
      } else if (text.includes('血压') || text.includes('监测') || text.includes('高血压')) {
        replyContent = '父母监测血压建议选用通过国际认证的【上臂式电子血压计】（腕式易受体位影响偏差大）。测量前静坐5分钟，袖带与心脏齐平。每天早晨起床后及晚上临睡前各测一次，记录3天以上的平均值更具临床参考价值。';
        suggestedIds = ['prod_2'];
      } else if (text.includes('熬夜') || text.includes('心慌') || text.includes('胸闷') || text.includes('疲劳')) {
        replyContent = '熬夜、高压工作后心肌耗氧量剧增，辅酶Q10是心肌细胞线粒体能量合成的关键辅酶，能帮助抗氧化和增强心肌动力。日常同时可搭配温和的酸枣仁膏调理深度睡眠，避免白天大量摄入浓茶咖啡。';
        suggestedIds = ['prod_6', 'prod_10'];
      } else if (text.includes('体检') || text.includes('长辈') || text.includes('50岁') || text.includes('癌症')) {
        replyContent = '50岁以上中老年人体检，重点推荐【低剂量螺旋CT（肺部筛查）】、【消化道胃肠镜/肿瘤标志物12项】以及【颈动脉彩超】。公立三甲协约体检支持检后主任医师免费解读报告，未检支持全额随时退款。';
        suggestedIds = ['prod_4'];
      } else {
        replyContent = '感谢您的咨询！健康养生需根据个人具体体质与病史综合评估。商城内所有保健食品均带有国家市场监管总局批准的“蓝帽子”标识，器械均具备医疗器械备案。若有急性身体不适，请及时前往医院就诊。';
        suggestedIds = ['prod_1', 'prod_3'];
      }

      const pharmacistMsg: PharmacistMessage = {
        id: `p_${Date.now()}`,
        sender: 'pharmacist',
        content: replyContent,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedProductIds: suggestedIds
      };

      setMessages(prev => [...prev, pharmacistMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[500px] bg-slate-50 overflow-hidden pb-16">
      {/* Top Pharmacist Identity Bar */}
      <div className="bg-white p-3 border-b border-slate-100 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
              <Stethoscope className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">李药师 · 执业中西药师</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-xs font-medium">
                认证在岗
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              三甲医院药剂科从业12年 · 科学用药与营养配比
            </div>
          </div>
        </div>

        <div className="text-right text-[10px] text-slate-400">
          <span>免费问诊</span>
          <div className="text-emerald-700 font-medium">响应时间 &lt;1分钟</div>
        </div>
      </div>

      {/* Safety Notice Warning */}
      <div className="bg-amber-50/80 border-b border-amber-200/50 px-3 py-1.5 text-[11px] text-amber-800 flex items-center gap-1.5">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>药师建议仅供日常保健参考，不可替代线下医疗机构诊断处方。</span>
      </div>

      {/* Message Chat Feed */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 max-w-[90%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-600 text-white shadow-2xs'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <ShieldCheck className="w-4 h-4" />}
              </div>

              <div className="space-y-2">
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/70 rounded-tl-none shadow-2xs'
                  }`}
                >
                  <p>{msg.content}</p>
                  <div
                    className={`text-[9px] mt-1 text-right ${
                      isUser ? 'text-emerald-200' : 'text-slate-400'
                    }`}
                  >
                    {msg.time}
                  </div>
                </div>

                {/* Pharmacist Suggested Products Card */}
                {msg.suggestedProductIds && msg.suggestedProductIds.length > 0 && (
                  <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-2.5 space-y-2">
                    <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                      <span>药师推荐对症方案</span>
                    </div>

                    <div className="space-y-1.5">
                      {msg.suggestedProductIds.map((id) => {
                        const product = products.find((p) => p.id === id);
                        if (!product) return null;
                        return (
                          <div
                            key={product.id}
                            className="bg-white rounded-lg p-2 flex items-center gap-2 border border-slate-200/60 shadow-2xs"
                          >
                            <img
                              src={product.image}
                              alt={product.name}
                              referrerPolicy="no-referrer"
                              className="w-10 h-10 rounded-md object-cover bg-slate-100 shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate">
                                {product.name}
                              </div>
                              <div className="text-[10px] text-emerald-700 font-bold">
                                ¥{product.price}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => onSelectProduct(product)}
                                className="text-[10px] text-slate-500 hover:text-emerald-700 px-1.5 py-1"
                              >
                                详情
                              </button>
                              <button
                                onClick={() => onAddToCart(product)}
                                className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded-md"
                              >
                                加购
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic pl-9">
            <span className="animate-spin text-emerald-600 font-bold">●</span>
            执业药师正在认真分析回复...
          </div>
        )}
      </div>

      {/* Preset Fast Inquiries */}
      <div className="p-2 bg-white border-t border-slate-100">
        <div className="text-[10px] text-slate-400 mb-1 px-1">猜您想问：</div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {presetQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 rounded-lg whitespace-nowrap transition-colors border border-transparent hover:border-emerald-200 cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Input bar */}
      <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="向执业药师描述症状或用药困惑..."
          className="flex-1 bg-slate-100 text-xs px-3 py-2 rounded-xl border border-transparent focus:border-emerald-600 focus:bg-white focus:outline-hidden transition-all"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim()}
          className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-2xs"
          aria-label="发送消息"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
