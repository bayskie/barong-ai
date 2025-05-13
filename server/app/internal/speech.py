import os
from num2words import num2words
from g2p_id import G2P
from TTS.api import TTS
import re


def preprocess_text(text: str) -> str:
    g2p = G2P()
    phonetic_text = g2p(text)
    return phonetic_text


def synthesize_speech(text: str, out_path: str, speaker: str = "JV-00264") -> None:
    processed_text = preprocess_text(text)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(script_dir, '../data/tts/config.json')
    model_path = os.path.join(
        script_dir, '../data/tts/checkpoint_1260000-inference.pth')
    speakers_path = os.path.join(script_dir, "../data/tts/speakers.pth")

    tts = TTS(config_path=config_path,
              model_path=model_path,
              speakers_file_path=speakers_path)

    tts.tts_to_file(
        text=processed_text,
        file_path=out_path,
        speaker=speaker
    )
