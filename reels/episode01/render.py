#!/usr/bin/env python3
"""Render Instagram 9:16 Episode 1 using the ORIGINAL GitHub story illustrations."""
import asyncio, math, os, re, shutil, subprocess, sys, textwrap, wave
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[1]
ASSET=ROOT/'episodes/ep01/img'
OUTPUT=HERE/'output'
OUTPUT.mkdir(parents=True,exist_ok=True)
W,H,FPS=1080,1920,24
SCENES=[
  dict(image='4-arrows.jpg',title='A BOY STOPPED A RIVER?',line='With arrows? Impossible!',voice='Imagine a boy stopping a mighty river, with nothing but a bow and arrows!'),
  dict(image='1-meeting.jpg',title='A MAGICAL MEETING',line='King Shantanu meets Ganga',voice='Long ago, King Shantanu met Ganga, the river goddess, beside the sparkling waters of Hastinapura.'),
  dict(image='2-vasus.jpg',title='A MYSTERIOUS PROMISE',line='Seven star-spirits returned home',voice='They married, and Shantanu promised never to question Ganga. Seven little star-spirits returned to the heavens. Shantanu waited in silence.'),
  dict(image='3-learning.jpg',title='LITTLE BY LITTLE',line='Devavrata grew strong and wise',voice='Their eighth son, Devavrata, grew up learning patience, wisdom, and the skill of archery.'),
  dict(image='4-arrows.jpg',title='THE WALL OF ARROWS',line='A young warrior amazed the king',voice='Years later, Shantanu saw a young archer holding back the whole mighty river with a wall of arrows!'),
  dict(image='5-return.jpg',title='AT LAST, HOME AGAIN',line='Good things are worth waiting for',voice='That warrior was his own son. Ganga kept her promise, and father and son were reunited. Good things are worth waiting for.'),
]

def run(cmd):
    print('>', ' '.join(map(str,cmd))[:380],flush=True)
    subprocess.run(list(map(str,cmd)),check=True,stdout=subprocess.DEVNULL)

def secs(path):
    p=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',str(path)],capture_output=True,text=True,check=True)
    return float(p.stdout.strip())

def font(paths,size):
    for p in paths:
        if Path(p).exists(): return ImageFont.truetype(p,size)
    return ImageFont.load_default()

SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SERIF_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SANS='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
GOLD=(255,213,130)

def fit_lines(d,text,f,max_w):
    lines=[]; line=''
    for word in text.split():
        probe=(line+' '+word).strip()
        if d.textbbox((0,0),probe,font=f)[2]<=max_w: line=probe
        else:
            if line:lines.append(line)
            line=word
    if line:lines.append(line)
    return lines

def rounded_photo(canvas,img,coords,radius=25):
    x,y,w,h=coords
    fitted=Image.new('RGB',(w,h),(8,12,30))
    image=img.copy().convert('RGB')
    image.thumbnail((w,h),Image.Resampling.LANCZOS)
    fitted.paste(image,((w-image.width)//2,(h-image.height)//2))
    mask=Image.new('L',(w,h),0); d=ImageDraw.Draw(mask); d.rounded_rectangle((0,0,w-1,h-1),radius=radius,fill=255)
    canvas.paste(fitted,(x,y),mask)

def card(scene,ix):
    im=Image.open(ASSET/scene['image']).convert('RGB')
    # Full height atmospheric extension from the scene itself.
    bg=im.resize((W,H),Image.Resampling.BICUBIC).filter(ImageFilter.GaussianBlur(54))
    tint=Image.new('RGBA',(W,H),(9,14,38,208))
    canvas=Image.alpha_composite(bg.convert('RGBA'),tint)
    glow=Image.new('RGBA',(W,H),(0,0,0,0)); g=ImageDraw.Draw(glow)
    for r in range(550,0,-12):
        intensity=int(7*(1-r/550))
        g.ellipse((W//2-r,450-r,W//2+r,450+r),fill=(243,183,91,intensity))
    canvas=Image.alpha_composite(canvas,glow)
    d=ImageDraw.Draw(canvas)
    # Premium restrained editorial identity.
    f_brand=font([SANS_BOLD],28); f_ep=font([SANS],31)
    d.line((90,130,350,130),fill=(*GOLD,120),width=2)
    d.text((W/2,156),'K I D S   M A H A B H A R A T H',anchor='mm',font=f_brand,fill=(255,218,153))
    d.text((W/2,219),'EPISODE 01  ·  THE RIVER GODDESS & THE BRAVE PRINCE',anchor='mm',font=f_ep,fill=(226,226,234))
    # Full, uncropped original artwork.
    img_w=1004; img_h=777; x=(W-img_w)//2; y=324
    d.rounded_rectangle((x-5,y-5,x+img_w+5,y+img_h+5),radius=31,fill=(255,208,113,115))
    rounded_photo(canvas,im,(x,y,img_w,img_h))
    d=ImageDraw.Draw(canvas)
    d.rounded_rectangle((x,y,x+img_w,y+img_h),radius=24,outline=(247,213,145),width=4)
    # Text hierarchy under picture.
    d.line((143,1198,W-143,1198),fill=(246,203,117,155),width=2)
    f_title=font([SERIF_BOLD],62)
    lines=fit_lines(d,scene['title'],f_title,W-125)
    for j,line in enumerate(lines):
        d.text((W/2,1260+j*78),line,anchor='mm',font=f_title,fill=(255,246,226),stroke_width=1,stroke_fill=(29,23,30))
    f_sub=font([SANS],38)
    sub_y=1350+(len(lines)-1)*75
    d.text((W/2,sub_y),scene['line'],anchor='mm',font=f_sub,fill=GOLD)
    # Captions are burned in later near 1540.
    d.rounded_rectangle((65,1690,W-65,1810),radius=35,outline=(241,204,129,170),width=2,fill=(8,11,33,170))
    f_end=font([SANS_BOLD],30)
    d.text((W/2,1728),'STORY TIME  •  PART 1',anchor='mm',font=f_end,fill=(248,232,201))
    f_web=font([SANS],25)
    d.text((W/2,1772),'Kids Mahabharath   |   Read the full story in the caption',anchor='mm',font=f_web,fill=(213,211,216))
    d.text((W/2,1860),'✦  A BEDTIME STORY WITH A LESSON  ✦',anchor='mm',font=font([SANS],24),fill=(242,210,147))
    out=OUTPUT/f'card_{ix:02d}.jpg'; canvas.convert('RGB').save(out,quality=93,subsampling=0)
    return out

async def get_voice(text,out):
    try:
        import edge_tts
        await edge_tts.Communicate(text,voice='en-IN-NeerjaNeural',rate='-7%',pitch='-2Hz').save(str(out))
        if out.stat().st_size<2000: raise RuntimeError('TTS returned no audio')
        return out
    except Exception as ex:
        print('edge-tts unavailable:',ex,' -- falling back to espeak',file=sys.stderr)
        wav=out.with_suffix('.wav')
        run(['espeak','-v','en+f3','-s','138','-p','48','-w',str(wav),text])
        return wav

def seconds_caption_lines(text):
    # Display phrase-sized subtitling without covering the illustrations.
    words=text.split(); groups=[]; i=0
    while i<len(words):
        j=min(i+5,len(words))
        if len(words)-j==1 and j<len(words):j=len(words)
        groups.append(' '.join(words[i:j]));i=j
    return groups

def clock(t):
    t=max(0.0,t); h=int(t//3600); m=int((t%3600)//60); s=t%60
    return f'{h}:{m:02d}:{s:05.2f}'

def make_subtitles(durations):
    lines=['[Script Info]','ScriptType: v4.00+','PlayResX: 1080','PlayResY: 1920','WrapStyle: 0','ScaledBorderAndShadow: yes','','[V4+ Styles]','Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding', 'Style: Default,DejaVu Sans,51,&H00FFFFFF,&H00FFFFFF,&H00121825,&H98070A19,-1,0,0,0,100,100,0,0,3,2,0,2,95,95,355,1','','[Events]','Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text']
    t=0.0
    for scene,duration in zip(SCENES,durations):
        groups=seconds_caption_lines(scene['voice']); speaking=duration-0.65
        counts=[len(g) for g in groups]; total=sum(counts)
        acc=0.0
        for group,n in zip(groups,counts):
            start=t+max(0.08,acc); dur=speaking*n/total; end=t+acc+dur
            txt=group.replace(',','،').replace('!','!').replace('...','…')
            lines.append(f'Dialogue: 0,{clock(start)},{clock(end)},Default,,0,0,0,,{txt}')
            acc+=dur
        t+=duration
    path=OUTPUT/'captions.ass';path.write_text('\n'.join(lines),encoding='utf-8')
    return path

def make_music(duration,out):
    # Original generated ambience: three softly modulated pads + small chime, no copyrighted tracks.
    sr=32000; n=int((duration+1)*sr)
    t=np.arange(n,dtype=np.float64)/sr
    f=[146.83,196.0,246.94,293.66]
    audio=np.zeros(n,dtype=np.float64)
    for j,freq in enumerate(f):
        mod=.65+.35*np.sin(2*np.pi*(0.037+j*.013)*t+j)
        audio+=(0.024/(j+1))*mod*np.sin(2*np.pi*freq*t)
        audio+=(0.006/(j+1))*mod*np.sin(2*np.pi*(freq*2.004)*t)
    # Bell-like pluck every ~12sec.
    for sec in [0,12,25,37,49]:
        k=int(sec*sr); size=min(int(3.2*sr),n-k)
        if size>0:
            u=np.arange(size)/sr
            audio[k:k+size]+=0.008*np.exp(-1.4*u)*(np.sin(2*np.pi*784*u)+0.34*np.sin(2*np.pi*1176*u))
    fadein=np.minimum(1,t/2.2);fadeout=np.minimum(1,(duration+0.3-t)/2.7)
    audio*=np.clip(fadein,0,1)*np.clip(fadeout,0,1)
    raw=np.clip(audio,-.95,.95)
    with wave.open(str(out),'wb') as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(sr);w.writeframes((raw*32767).astype('<i2').tobytes())

def main():
    print('Image asset directory:',ASSET)
    for sc in SCENES:
        if not (ASSET/sc['image']).exists():raise FileNotFoundError(ASSET/sc['image'])
    files=[];durations=[]
    for i,scene in enumerate(SCENES):
        art=card(scene,i)
        voice_path=asyncio.run(get_voice(scene['voice'],OUTPUT/f'voice_{i:02d}.mp3'))
        duration=round(secs(voice_path)+0.75,2)
        durations.append(duration)
        v=OUTPUT/f'segment_{i:02d}.mp4'
        # Delicate continuous push-in; gently fade scenes without abrupt cuts.
        vf=(f'scale=1160:2062,zoompan=z=\'min(zoom+0.00022,1.075)\':'
            f'x=\'iw/2-(iw/zoom/2)\':y=\'ih/2-(ih/zoom/2)\':'
            f'd=1:s=1080x1920:fps=24,'
            f'fade=t=in:st=0:d=0.36,fade=t=out:st={max(0,duration-.33):.2f}:d=0.30,format=yuv420p')
        cmd=['ffmpeg','-y','-hide_banner','-loglevel','error','-loop','1','-framerate',str(FPS),'-i',art,'-i',voice_path,'-vf',vf,'-af','apad','-t',str(duration),'-r',str(FPS),'-c:v','libx264','-pix_fmt','yuv420p','-preset','veryfast','-crf','20','-c:a','aac','-ar','48000','-ac','2','-b:a','160k','-movflags','+faststart',v]
        run(cmd);files.append(v)
    lst=OUTPUT/'segments.txt';lst.write_text(''.join(f"file '{v.resolve()}'\n" for v in files))
    assembled=OUTPUT/'assembled.mp4'
    run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',lst,'-c','copy',assembled])
    total=secs(assembled)
    music=OUTPUT/'ambient_original.wav';make_music(total,music)
    subtitles=make_subtitles(durations)
    video=OUTPUT/'Kids_Mahabharath_Episode_01_Instagram_Reel.mp4'
    run(['ffmpeg','-y','-hide_banner','-loglevel','error','-i',assembled,'-i',music,'-filter_complex',f'[0:v]subtitles={subtitles}:fontsdir=/usr/share/fonts/truetype/dejavu[v];[0:a]volume=1.12[a0];[1:a]volume=0.50[a1];[a0][a1]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.96[a]','-map','[v]','-map','[a]','-c:v','libx264','-preset','veryfast','-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',video])
    print('OUTPUT:',video,'duration:',secs(video),'seconds','size:',video.stat().st_size)

if __name__=='__main__':main()