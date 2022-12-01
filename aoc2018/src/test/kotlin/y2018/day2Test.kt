package y2018

import org.junit.Assert.assertEquals
import org.junit.Test
import java.io.File

class day2Test {
    fun parseFile(name: String): Array<String> {
        val fileUri = javaClass.classLoader.getResource(name).toURI()
        val lines = MutableList(0) {""}
        File(fileUri).forEachLine { line -> lines.add(line)  }
        return lines.toTypedArray()
    }

    @Test
    fun testChecksum1() {
        assertEquals(Pair(false, false), checksum("abcdef"))
    }

    @Test
    fun testChecksum2() {
        assertEquals(Pair(true, true), checksum("bababc"))
    }

    @Test
    fun test1() {
        assertEquals(12, day2(arrayOf("abcdef", "bababc", "abbcde", "abcccd", "aabcdd", "abcdee", "ababab")))
    }

    @Test
    fun testActual() {
        assertEquals(6200, day2(parseFile("y2018/day02ActualInput.txt")))
    }

    @Test
    fun test1Second() {
        assertEquals("fgij", day2Second(arrayOf("abcde", "fghij", "klmno", "pqrst", "fguij", "axcye", "wvxyz")))
    }

    @Test
    fun testActualSecond() {
        assertEquals("xpysnnkqrbuhefmcajodplyzw", day2Second(parseFile("y2018/day02ActualInput.txt")))
    }
}