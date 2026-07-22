import { currTime } from "./time.js";

/**
 * 1번인자 - eventSource: 발생 원인, 
 * 2번인자 - message: 메시지
 * 3번인자 - 레벨 (기본 INFO)
 */
export default function logger(eventSource, message, level = "INFO") {
  console.log(`[${currTime()}] [${level}] [${eventSource}] ${message}`);
}